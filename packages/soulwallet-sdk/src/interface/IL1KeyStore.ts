import { Ok, Err, Result } from '@soulwallet/result';
import { TypedDataDomain, TypedDataField } from 'ethers';

export interface GuardianSignature {
    /**
     * 0:EIP-1271 signature, 1:approved onchain before, 2:EOA signature, 3:No signature provided
     *
     * @type {number}
     * @memberof GuardianSignature
     */
    signatureType: 0 | 1 | 2 | 3;

    /**
     * Guardian address
     *
     * @type {string}
     * @memberof GuardianSignature
     */
    address: string;

    /**
     * Signature
     *
     * @type {string}
     * @memberof GuardianSignature
     */
    signature?: string;
}

export enum KeyStoreTypedDataType {
    /**
     * keccak256("SetKey(bytes32 keyStoreSlot,uint256 nonce,bytes32 newSigner)");
     */
    TYPE_HASH_SET_KEY = 'TYPE_HASH_SET_KEY',
    /**
     * keccak256("SetGuardian(bytes32 keyStoreSlot,uint256 nonce,bytes32 newGuardianHash)");
     */
    TYPE_HASH_SET_GUARDIAN = 'TYPE_HASH_SET_GUARDIAN',
    /**
     * keccak256("SetGuardianSafePeriod(bytes32 keyStoreSlot,uint256 nonce,uint64 newGuardianSafePeriod)");
     */
    TYPE_HASH_SET_GUARDIAN_SAFE_PERIOD = 'TYPE_HASH_SET_GUARDIAN_SAFE_PERIOD',
    /**
     * keccak256("CancelSetGuardian(bytes32 keyStoreSlot,uint256 nonce)");
     */
    TYPE_HASH_CANCEL_SET_GUARDIAN = 'TYPE_HASH_CANCEL_SET_GUARDIAN',
    /**
     * keccak256("CancelSetGuardianSafePeriod(bytes32 keyStoreSlot,uint256 nonce)");
     */
    TYPE_HASH_CANCEL_SET_GUARDIAN_SAFE_PERIOD = 'TYPE_HASH_CANCEL_SET_GUARDIAN_SAFE_PERIOD',
    /**
     * keccak256("SocialRecovery(bytes32 keyStoreSlot,uint256 nonce,bytes32 newSigner)");
     */
    TYPE_HASH_SOCIAL_RECOVERY = 'TYPE_HASH_SOCIAL_RECOVERY'
}

export interface KeyStoreInfo {
    /**
     * The address of the signer
     *
     * @type {string}
     * @memberof KeyStoreInfo
     */
    key: string;
    /**
     * The nonce of the slot
     *
     * @type {number}
     * @memberof KeyStoreInfo
     */
    nonce: number;
    /**
     * The hash of the 'raw guardian' of the slot
     *
     * @type {string}
     * @memberof KeyStoreInfo
     */
    guardianHash: string;
    /**
     * The hash of the 'raw pending guardian' of the slot
     *
     * @type {string}
     * @memberof KeyStoreInfo
     */
    pendingGuardianHash: string;

    /**
     * unix timestamp (second) of when the `pendingGuardianHash` is activated
     *
     * @type {number}
     * @memberof KeyStoreInfo
     */
    guardianActivateAt: number;

    /**
     * The safe period of the slot
     *
     * @type {number}
     * @memberof KeyStoreInfo
     */
    guardianSafePeriod: number;

    /**
     * new guardian safe period
     *
     * @type {number}
     * @memberof KeyStoreInfo
     */
    pendingGuardianSafePeriod: number;

    /**
     * unix timestamp (second) of when the `pendingGuardianSafePeriod` is activated
     *
     * @type {number}
     * @memberof KeyStoreInfo
     */
    guardianSafePeriodActivateAt: number;
}

/**
 * @interface IL1KeyStore
 * IL1KeyStore is a globally unique contract where each user determines their unique slot using the three fields: 
 * bytes32 initialKey, bytes32 initialGuardianHash, and uint64 initialGuardianSafePeriod.
 *
 * @abstract
 * @class IL1KeyStore
 */
export abstract class IL1KeyStore {
    /**
     *
     *
     * @abstract
     * @param {string} slot 
     * @return {*}  {Promise<Result<string, string>>} if return 0 address ,it means the slot is not set
     * @memberof IL1KeyStore
     */
    abstract getKey(slot: string): Promise<Result<string, Error>>;

    /**
     * get all slot info
     *
     * @abstract
     * @param {string} slot
     * @return {*}  {(Promise<Result<KeyStoreInfo, Error>>)}
     * @memberof IL1KeyStore
     */
    abstract getKeyStoreInfo(slot: string): Promise<Result<KeyStoreInfo, Error>>;

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
    abstract getTypedData(
        type: KeyStoreTypedDataType,
        slot: string,
        data?: string
    ): Promise<Result<{
        domain: TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
        value: Record<string, any>,
        typedMessage: string
    }, Error>>;

}