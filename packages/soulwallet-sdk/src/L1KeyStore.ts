import { GuardianSignature, IL1KeyStore, KeyStoreInfo, KeyStoreTypedDataType } from "./interface/IL1KeyStore.js";
import { TypeGuard } from "./tools/typeGuard.js";
import { TypedDataDomain, TypedDataField, ethers } from "ethers";
import { ABI_KeyStore } from "@soulwallet/abi";
import { Hex } from "./tools/hex.js";
import { Ok, Err, Result } from '@soulwallet/result';
import { bigIntToNumber } from './tools/convert.js';

/**
 * L1KeyStore
 *
 * @export
 * @class L1KeyStore
 * @implements {IL1KeyStore}
 */
export class L1KeyStore implements IL1KeyStore {

    static readonly days = 86400;

    readonly L1KeyStoreContractAddress: string;
    readonly L1Provider: ethers.JsonRpcProvider;
    readonly L1KeyStoreContract: ethers.Contract;


    /**
     * Creates an instance of IL1KeyStore.
     * @param {string} L1RPC
     * @param {string} L1KeyStoreContractAddress
     * @memberof IL1KeyStore
     */
    constructor(_L1Provider: string | ethers.JsonRpcProvider, _L1KeyStoreContractAddress: string) {
        const ret = TypeGuard.onlyAddress(_L1KeyStoreContractAddress);
        if (ret.isErr() === true) {
            throw new Error(ret.ERR);
        }

        if (typeof _L1Provider === 'string') {
            const ret = TypeGuard.httpOrHttps(_L1Provider);
            if (ret.isErr() === true) {
                throw new Error(ret.ERR);
            }
            this.L1Provider = new ethers.JsonRpcProvider(_L1Provider);
        } else {
            this.L1Provider = _L1Provider;
        }

        this.L1KeyStoreContractAddress = _L1KeyStoreContractAddress;

        this.L1KeyStoreContract = new ethers.Contract(this.L1KeyStoreContractAddress, ABI_KeyStore, this.L1Provider);
    }

    static bytes32ToAddress(bytes32: string): string {
        TypeGuard.onlyBytes32(bytes32);
        return ethers.getAddress('0x' + bytes32.slice(26));
    }
    static addressToBytes32(address: string): string {
        TypeGuard.onlyAddress(address);
        return Hex.paddingZero(address, 32);
    }

    private static guardianSafePeriodGuard(guardianSafePeriod: number): Result<true, string> {
        if (guardianSafePeriod < (this.days * 2)) {
            return new Err("initialGuardianSafePeriod is too small");
        }
        if (guardianSafePeriod > (this.days * 30)) {
            return new Err("initialGuardianSafePeriod is too large");
        }
        return new Ok(true);
    }

    /**
     * calculate the slot
     *
     * @static
     * @param {string} initialKey bytes32
     * @param {string} initialGuardianHash bytes32
     * @param {number} [initialGuardianSafePeriod=2 * this.days]
     * @return {*}  {string} bytes32
     * @memberof L1KeyStore
     */
    static getSlot(initialKey: string, initialGuardianHash: string, initialGuardianSafePeriod: number = 2 * this.days): string {
        let ret = TypeGuard.onlyBytes32(initialKey);
        if (ret.isErr() === true) {
            throw new Error(ret.ERR);
        }
        ret = TypeGuard.onlyBytes32(initialGuardianHash);
        if (ret.isErr() === true) {
            throw new Error(ret.ERR);
        }
        ret = this.guardianSafePeriodGuard(initialGuardianSafePeriod);
        if (ret.isErr() === true) {
            throw new Error(ret.ERR);
        }

        // bytes32 initialKey, bytes32 initialGuardianHash, uint64 guardianSafePeriod
        // keccak256(abi.encode(initialKey, initialGuardianHash, guardianSafePeriod));  
        const abiEncoded = new ethers.AbiCoder().encode(["bytes32", "bytes32", "uint64"], [initialKey, initialGuardianHash, initialGuardianSafePeriod]);
        const keccak256 = ethers.keccak256(abiEncoded);
        return keccak256;
    }

    /**
     * pack guardian info into bytes
     *
     * @param {string[]} guardians EOA/Smart contract address array (auto sort)
     * @param {number} threshold
     * @param {string} salt hex string (bytes32),default is 0
     * @return {*}  {string} keccak256 hash of the guardian set
     * @memberof IL1KeyStore
     */
    static getGuardianBytes(guardians: string[], threshold: number, salt: string = ethers.ZeroHash): string {
        if (guardians.length === 0) {
            return '0x';
        }

        /* 
        (address[] memory guardians, uint256 threshold, uint256 salt) =
            abi.decode(rawGuardian, (address[], uint256, uint256));
        */
        // deep copy guardians,to avoid sort the original array
        guardians = [...guardians];
        guardians.sort((a, b) => {
            {
                const ret = TypeGuard.onlyAddress(a);
                if (ret.isErr() === true) {
                    throw new Error(ret.ERR);
                }
            }

            const aBig = BigInt(a);
            const bBig = BigInt(b);
            if (aBig === bBig) {
                throw new Error(`guardian address is duplicated: ${a}`);
            } else if (aBig < bBig) {
                return -1;
            } else {
                return 1;
            }
        });
        const ret = TypeGuard.onlyBytes32(salt);
        if (ret.isErr() === true) {
            throw new Error(ret.ERR);
        }

        const abiEncoded = new ethers.AbiCoder().encode(["address[]", "uint256", "uint256"], [guardians, threshold, salt]);
        return abiEncoded;
    }

    /**
     * calculate the guardian hash
     *
     * @abstract
     * @param {string[]} guardians EOA/Smart contract address array (auto sort)
     * @param {number} threshold
     * @param {string} salt hex string (bytes32),default is 0
     * @return {*}  {string} keccak256 hash of the guardian set
     * @memberof IL1KeyStore
     */
    static calcGuardianHash(guardians: string[], threshold: number, salt: string = ethers.ZeroHash): string {
        if (guardians.length === 0) {
            return ethers.ZeroHash;
        }

        const abiEncoded = L1KeyStore.getGuardianBytes(guardians, threshold, salt);
        const keccak256 = ethers.keccak256(abiEncoded);
        return keccak256;
    }

    /**
     * pack guardian signatures into `guardianSignature` bytes
     *
     * @static
     * @param {GuardianSignature[]} guardianSignature
     * @return {*}  {string}
     * @memberof L1KeyStore
     */
    static packGuardianSignature(guardianSignature: GuardianSignature[]): string {
        // deep copy guardianSignature,to avoid sort the original array
        guardianSignature = [...guardianSignature];
        guardianSignature.sort((a, b) => {
            const aBig = BigInt(a.address);
            const bBig = BigInt(b.address);
            if (aBig === bBig) {
                throw new Error(`guardian address is duplicated: ${a}`);
            } else if (aBig < bBig) {
                return -1;
            } else {
                return 1;
            }
        });
        const signs: string[] = [];

        let skipTimes = 0;

        for (let index = 0; index < guardianSignature.length; index++) {
            /*  
           one signature structure:
            ┌──────────┬──────────────┬──────────┬────────────────┐
            │          │              │          │                │
            │    v     │       s      │   r      │  dynamic data  │
            │  bytes1  │bytes4|bytes32│  bytes32 │     dynamic    │
            │  (must)  │  (optional)  │(optional)│   (optional)   │
            └──────────┴──────────────┴──────────┴────────────────┘ 
            */
            let oneSign = '';
            const guardianSign = guardianSignature[index];
            if (guardianSign.signatureType === 3) {
                //3:No signature provided
                skipTimes++;
            } else {
                if (skipTimes > 0) {
                    /* 
                        v = 2
                            skip
                            s: bytes4 skip times
                            r: no set
                    */
                    oneSign = '02';
                    oneSign += Hex.paddingZero(skipTimes - 1, 4).slice(2);
                    signs.push(oneSign);
                    skipTimes = 0;
                }
                let signature = guardianSign.signature ?? "";
                if (signature.startsWith('0x')) {
                    signature = signature.slice(2);
                }
                if (signature.length % 2 !== 0) {
                    throw new Error('signature invalid');
                }
                const signatureLen = signature.length / 2;
                switch (guardianSign.signatureType) {
                    case 0://0:EIP-1271 signature
                        /*
                            v = 0
                                EIP-1271 signature
                                s: bytes4 Length of signature data 
                                r: no set
                                dynamic data: signature data
                         */
                        oneSign = '00';
                        oneSign += Hex.paddingZero(signatureLen, 4).slice(2);
                        oneSign += signature;
                        break;
                    case 1://1:approved onchain before
                        /* 
                           v = 1
                               approved hash
                               r: no set
                               s: no set
                        */
                        oneSign = '01';
                        break;
                    case 2://2:EOA signature
                        /* 
                            v > 2
                                EOA signature
                        */
                        // r, s, v => v, s, r
                        // eslint-disable-next-line no-case-declarations
                        const r = signature.slice(0, 64); const s = signature.slice(64, 128); const v = signature.slice(128, 130);
                        oneSign = v + s + r;
                        break;
                    default:
                        throw new Error('unknown signatureType');
                }
                signs.push(oneSign);
            }

        }

        if (skipTimes > 0) {
            /* 
                v = 2
                    skip
                    s: bytes4 skip times
                    r: no set
            */
            let oneSign = '02';
            oneSign += Hex.paddingZero(skipTimes - 1, 4).slice(2);
            signs.push(oneSign);
            skipTimes = 0;
        }


        return '0x' + signs.join('');
    }

    /**
     * get the key stored in the slot
     *
     * @param {string} slot bytes32
     * @return {*}  {Promise<Result<string, Error>>} bytes32 key 
     * @memberof L1KeyStore
     */
    async getKey(slot: string): Promise<Result<string, Error>> {
        const ret = TypeGuard.onlyBytes32(slot);
        if (ret.isErr() === true) {
            return new Err(
                new Error(ret.ERR)
            );
        }
        try {
            // function getKey(bytes32 slot) external view returns (bytes32 key);
            const data = await this.L1KeyStoreContract.getKey(slot);
            return new Ok(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return new Err(error);
            } else {
                return new Err(
                    new Error('unknown error')
                );
            }
        }
    }

    /**
     * get slot info
     *
     * @param {string} slot bytes32
     * @return {*}  {(Promise<Result<KeyStoreInfo, Error>>)} 
     * @memberof L1KeyStore
     */
    async getKeyStoreInfo(slot: string): Promise<Result<KeyStoreInfo, Error>> {
        const ret = TypeGuard.onlyBytes32(slot);
        if (ret.isErr() === true) {
            return new Err(
                new Error(ret.ERR)
            );
        }
        try {
            // function getKeyStoreInfo(bytes32 slot) external pure override returns (keyStoreInfo memory _keyStoreInfo)
            const data = await this.L1KeyStoreContract.getKeyStoreInfo(slot);
            /*
                data[0]     bytes32 key; 
                data[1]     uint256 nonce; 
                data[2]     bytes32 guardianHash; 
                data[3]     bytes32 pendingGuardianHash; 
                data[4]     uint64 guardianActivateAt; 
                data[5]     uint64 guardianSafePeriod; 
                data[6]     uint64 pendingGuardianSafePeriod; 
                data[7]     uint64 guardianSafePeriodActivateAt;
            */
            const _keyStoreInfo: KeyStoreInfo = {
                key: data[0],
                nonce: bigIntToNumber(data[1]),
                guardianHash: data[2],
                pendingGuardianHash: data[3],
                guardianActivateAt: bigIntToNumber(data[4]),
                guardianSafePeriod: bigIntToNumber(data[5]),
                pendingGuardianSafePeriod: bigIntToNumber(data[6]),
                guardianSafePeriodActivateAt: bigIntToNumber(data[7])
            }
            return new Ok(_keyStoreInfo);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return new Err(error);
            } else {
                return new Err(
                    new Error('unknown error')
                );
            }
        }
    }


    /**
     * calc sig hash
     *
     * @static
     * @param {string} L1KeyStoreContractAddress L1KeyStore contract address
     * @param {string} slot bytes32 slot
     * @param {number} nonce uint256 nonce
     * @param {string} data bytes32 data ( padded to bytes32 owner address | guardian Hash )
     * @return {*}  {string}
     * @memberof L1KeyStore
     */
    static getSigHash(L1KeyStoreContractAddress: string, slot: string, nonce: number, data: string): string {
        TypeGuard.onlyBytes32(slot);
        TypeGuard.onlyBytes32(data);
        const abiEncoded = new ethers.AbiCoder().encode(
            ["address", "bytes32", "uint256", "bytes32"],
            [L1KeyStoreContractAddress, slot, nonce, data]);
        const keccak256 = ethers.keccak256(abiEncoded);
        return keccak256;
    }

    /**
     * get sign hash of the setKey
     *
     * @param {string} slot bytes32 slot
     * @param {string} bytes32Key the new key
     * @return {*}  {Promise<Result<string, Error>>}
     * @memberof L1KeyStore
     */
    async getSetKeySigHash(slot: string, bytes32Key: string): Promise<Result<string, Error>> {
        TypeGuard.onlyBytes32(bytes32Key);
        const ret = await this.getKeyStoreInfo(slot);
        if (ret.isErr() === true) {
            return new Err(ret.ERR);
        }
        const nonce = ret.OK.nonce;
        return new Ok(L1KeyStore.getSigHash(this.L1KeyStoreContractAddress, slot, nonce, bytes32Key));
    }

    /**
     * get sign hash of the setGuardian
     *
     * @param {string} slot bytes32 slot
     * @param {string} guardianHash bytes32 guardianHash
     * @return {*}  {Promise<Result<string, Error>>}
     * @memberof L1KeyStore
     */
    async getSetGuardianSigHash(slot: string, guardianHash: string): Promise<Result<string, Error>> {
        TypeGuard.onlyBytes32(guardianHash);
        const ret = await this.getKeyStoreInfo(slot);
        if (ret.isErr() === true) {
            return new Err(ret.ERR);
        }
        const nonce = ret.OK.nonce;
        return new Ok(L1KeyStore.getSigHash(this.L1KeyStoreContractAddress, slot, nonce, guardianHash));
    }

    /**
     * Get EIP-712 typed data for a specific slot
     *
     * @static
     * @param {KeyStoreTypedDataType} type Interact Type
     * @param {number} chainId chainId
     * @param {string} keyStoreContract keyStoreContract address
     * @param {string} slot bytes32 slot
     * @param {number} nonce uint256 nonce
     * @param {(string)} [data] Interact Arg (Hex string): 
     * 
     * TYPE_HASH_SET_KEY: "newSigner":"bytes32". 
     * 
     * TYPE_HASH_SET_GUARDIAN: "newGuardianHash":"bytes32". 
     * 
     * TYPE_HASH_SET_GUARDIAN_SAFE_PERIOD: "newGuardianSafePeriod":"uint64". 
     * 
     * TYPE_HASH_CANCEL_SET_GUARDIAN: no need. 
     * 
     * TYPE_HASH_CANCEL_SET_GUARDIAN_SAFE_PERIOD: no need. 
     * 
     * TYPE_HASH_SOCIAL_RECOVERY: "newSigner":"bytes32".
     * 
     * 
     * @return {*}  {{
     *         domain: TypedDataDomain,
     *         types: Record<string, Array<TypedDataField>>,
     *         value: Record<string, any>,
     *         typedMessage: string
     *     }}
     * @memberof L1KeyStore
     */
    static getTypedData(type: KeyStoreTypedDataType, chainId: number, keyStoreContract: string, slot: string, nonce: number, data?: string): {
        domain: TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: Record<string, any>,
        typedMessage: string
    } {
        if (TypeGuard.onlyBytes32(slot).isErr() === true) throw new Error('slot must be bytes32');
        const domain: TypedDataDomain = {
            name: "KeyStore",
            version: "1",
            chainId: chainId.toString(),
            verifyingContract: ethers.getAddress(keyStoreContract)
        };
        let types: Record<string, Array<TypedDataField>>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: Record<string, any>;
        switch (type) {
            case KeyStoreTypedDataType.TYPE_HASH_SET_KEY:
                // keccak256("SetKey(bytes32 keyStoreSlot,uint256 nonce,bytes32 newSigner)");
                types = {
                    SetKey: [
                        { name: "keyStoreSlot", type: "bytes32" },
                        { name: "nonce", type: "uint256" },
                        { name: "newSigner", type: "bytes32" }
                    ]
                };
                if (TypeGuard.onlyBytes32(data!).isErr() === true) throw new Error('data must be bytes32');
                value = {
                    keyStoreSlot: slot,
                    nonce: nonce,
                    newSigner: data!
                };
                break;
            case KeyStoreTypedDataType.TYPE_HASH_SET_GUARDIAN:
                // keccak256("SetGuardian(bytes32 keyStoreSlot,uint256 nonce,bytes32 newGuardianHash)");
                types = {
                    SetGuardian: [
                        { name: "keyStoreSlot", type: "bytes32" },
                        { name: "nonce", type: "uint256" },
                        { name: "newGuardianHash", type: "bytes32" }
                    ]
                };
                if (TypeGuard.onlyBytes32(data!).isErr() === true) throw new Error('data must be bytes32');
                value = {
                    keyStoreSlot: slot,
                    nonce: nonce,
                    newGuardianHash: data!
                };
                break;
            case KeyStoreTypedDataType.TYPE_HASH_SET_GUARDIAN_SAFE_PERIOD:
                // keccak256("SetGuardianSafePeriod(bytes32 keyStoreSlot,uint256 nonce,uint64 newGuardianSafePeriod)");
                types = {
                    SetGuardianSafePeriod: [
                        { name: "keyStoreSlot", type: "bytes32" },
                        { name: "nonce", type: "uint256" },
                        { name: "newGuardianSafePeriod", type: "uint64" }
                    ]
                };
                // eslint-disable-next-line no-case-declarations
                const ret = TypeGuard.maxToUint64(data!);
                if (ret.isErr() === true) {
                    throw new Error('data must be uint64');
                }
                value = {
                    keyStoreSlot: slot,
                    nonce: nonce,
                    newGuardianSafePeriod: ret.OK
                };
                break;
            case KeyStoreTypedDataType.TYPE_HASH_CANCEL_SET_GUARDIAN:
                // keccak256("CancelSetGuardian(bytes32 keyStoreSlot,uint256 nonce)");
                types = {
                    CancelSetGuardian: [
                        { name: "keyStoreSlot", type: "bytes32" },
                        { name: "nonce", type: "uint256" }
                    ]
                };
                if (typeof data !== 'undefined') {
                    throw new Error('data must be undefined');
                }
                value = {
                    keyStoreSlot: slot,
                    nonce: nonce
                };
                break;
            case KeyStoreTypedDataType.TYPE_HASH_CANCEL_SET_GUARDIAN_SAFE_PERIOD:
                // keccak256("CancelSetGuardianSafePeriod(bytes32 keyStoreSlot,uint256 nonce)");
                types = {
                    CancelSetGuardianSafePeriod: [
                        { name: "keyStoreSlot", type: "bytes32" },
                        { name: "nonce", type: "uint256" }
                    ]
                };
                if (typeof data !== 'undefined') {
                    throw new Error('data must be undefined');
                }
                value = {
                    keyStoreSlot: slot,
                    nonce: nonce
                };
                break;
            case KeyStoreTypedDataType.TYPE_HASH_SOCIAL_RECOVERY:
                // keccak256("SocialRecovery(bytes32 keyStoreSlot,uint256 nonce,bytes32 newSigner)");
                types = {
                    SocialRecovery: [
                        { name: "keyStoreSlot", type: "bytes32" },
                        { name: "nonce", type: "uint256" },
                        { name: "newSigner", type: "bytes32" },
                    ]
                };
                if (TypeGuard.onlyBytes32(data!).isErr() === true) throw new Error('data must be bytes32');
                value = {
                    keyStoreSlot: slot,
                    nonce: nonce,
                    newSigner: data!
                };
                break;
            default:
                throw new Error('unknown type');
        }

        const typedMessage = ethers.TypedDataEncoder.hash(domain, types, value);

        return {
            domain,
            types,
            value,
            typedMessage
        };
    }


    /**
     * Get EIP-712 typed data for a specific slot
     *
     * @abstract
     * @param {KeyStoreTypedDataType} type Interact Type
     * @param {string} slot slot
     * @param {(string)} [data] Interact Arg (Hex string): 
     * 
     * TYPE_HASH_SET_KEY: "newSigner":"bytes32". 
     * 
     * TYPE_HASH_SET_GUARDIAN: "newGuardianHash":"bytes32". 
     * 
     * TYPE_HASH_SET_GUARDIAN_SAFE_PERIOD: "newGuardianSafePeriod":"uint64". 
     * 
     * TYPE_HASH_CANCEL_SET_GUARDIAN: no need. 
     * 
     * TYPE_HASH_CANCEL_SET_GUARDIAN_SAFE_PERIOD: no need. 
     * 
     * TYPE_HASH_SOCIAL_RECOVERY: "newSigner":"bytes32".
     * 
     * 
     * @return {*}  {Promise<Result<{
     *         domain: TypedDataDomain,
     *         types: Record<string, Array<TypedDataField>>,
     *         value: Record<string, any>,
     *         typedMessage: string
     *     }, Error>>}
     * @memberof IL1KeyStore
     */
    async getTypedData(
        type: KeyStoreTypedDataType,
        slot: string,
        data?: string
    ): Promise<Result<{
        domain: TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: Record<string, any>,
        typedMessage: string
    }, Error>> {
        let chainId = 0;
        try {
            chainId = bigIntToNumber(((await this.L1Provider.getNetwork()).chainId));
        } catch (error: unknown) {
            if (error instanceof Error) {
                return new Err(error);
            } else {
                return new Err(
                    new Error('unknown error')
                );
            }
        }
        const slotInfo = await this.getKeyStoreInfo(slot);
        if (slotInfo.isErr() === true) {
            return new Err(slotInfo.ERR);
        }

        try {
            const ret = L1KeyStore.getTypedData(
                type,
                chainId,
                this.L1KeyStoreContractAddress,
                slot,
                slotInfo.OK.nonce,
                data
            );
            return new Ok(ret);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return new Err(error);
            } else {
                return new Err(
                    new Error('unknown error')
                );
            }
        }
    }

}