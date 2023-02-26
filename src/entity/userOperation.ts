import { ethers, BigNumber } from "ethers";
import { AddressZero } from "../defines/address";
import { NumberLike, toDecString, toHexString } from "../defines/numberLike";
import { UserOp } from '../utils/userOp';
/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol    
 */

/**
 * @class UserOperation
 * @description UserOperation class
 * @example
 * const userOperation = new UserOperation();
 * @property {String} sender the sender address
 * @property {NumberLike} nonce the nonce
 * @property {String} initCode the initCode
 * @property {String} callData the callData
 * @property {String} preVerificationGas the preVerificationGas
 * @property {String} verificationGasLimit the verificationGasLimit
 * @property {String} maxFeePerGas the maxFeePerGas
 * @property {String} maxPriorityFeePerGas the maxPriorityFeePerGas
 * @property {String} paymasterAndData the paymasterAndData
 * @property {String} signature the signature
 */

class UserOperation {

    private _userOp: UserOp;

    private _specifiedVerificationGasLimit = false;
    private _specifiedPreVerificationGas = false;

    /**
     * Creates an instance of UserOperation.
     * @param {string} [sender='']
     * @param {NumberLike} [nonce=0]
     * @param {string} [initCode='0x']
     * @param {string} [callData='0x']
     * @param {NumberLike} [callGasLimit=0]
     * @param {NumberLike} [maxFeePerGas=0]
     * @param {NumberLike} [maxPriorityFeePerGas=0]
     * @param {string} [paymasterAndData='0x']
     * @param {NumberLike} [verificationGasLimit=0]
     * @param {NumberLike} [preVerificationGas=0]
     * @param {string} [signature='0x']
     * @memberof UserOperation
     */
    constructor(sender: string = '', nonce: NumberLike = 0, initCode: string = '0x', callData: string = '0x', callGasLimit: NumberLike = 0, maxFeePerGas: NumberLike = 0, maxPriorityFeePerGas: NumberLike = 0, paymasterAndData: string = '0x', verificationGasLimit: NumberLike = 0, preVerificationGas: NumberLike = 0, signature: string = '0x') {
        this._userOp = new UserOp();
        this._sender = sender;
        this._nonce = nonce;
        this._initCode = initCode;
        this._callData = callData;
        this._callGasLimit = callGasLimit;
        this._verificationGasLimit = verificationGasLimit;
        this._preVerificationGas = preVerificationGas;
        this._maxFeePerGas = maxFeePerGas;
        this._maxPriorityFeePerGas = maxPriorityFeePerGas;
        this._paymasterAndData = paymasterAndData;
        this._signature = signature;

        if (toDecString(verificationGasLimit) != '0') {
            this._specifiedVerificationGasLimit = true;
        }
        if (toDecString(preVerificationGas) != '0') {
            this._specifiedPreVerificationGas = true;
        }


        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();

    }


    private _sender: string = '';

    public get sender(): string {
        return this._sender;
    }
    public set sender(value: string) {
        if (!ethers.utils.isAddress(value)) {
            throw new Error('invalid sender address');
        }
        this._sender = value;

        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _nonce: NumberLike = 0;
    public get nonce(): NumberLike {
        return this._nonce;
    }
    public set nonce(value: NumberLike) {
        this._nonce = value;

        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _initCode: string = '0x';
    public get initCode(): string {
        return this._initCode;
    }
    public set initCode(value: string) {
        this._initCode = value;

        // update preVerificationGas & verificationGasLimit
        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }

    private _callData: string = '0x';
    public get callData(): string {
        return this._callData;
    }
    public set callData(value: string) {
        this._callData = value;

        // update preVerificationGas & verificationGasLimit
        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _callGasLimit: NumberLike = 0;
    public get callGasLimit(): NumberLike {
        return this._callGasLimit;
    }
    public set callGasLimit(value: NumberLike) {
        this._callGasLimit = value;

        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _verificationGasLimit: NumberLike = 0;//450000;
    public get verificationGasLimit(): NumberLike {
        return this._verificationGasLimit;
    }
    public set verificationGasLimit(value: NumberLike) {
        this._verificationGasLimit = value;
    }
    private _preVerificationGas: NumberLike = 0;//47000;
    public get preVerificationGas(): NumberLike {
        return this._preVerificationGas;
    }
    public set preVerificationGas(value: NumberLike) {
        this._preVerificationGas = value;
    }
    private _maxFeePerGas: NumberLike = 0;
    public get maxFeePerGas(): NumberLike {
        return this._maxFeePerGas;
    }
    public set maxFeePerGas(value: NumberLike) {
        this._maxFeePerGas = value;

        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _maxPriorityFeePerGas: NumberLike = 0;
    public get maxPriorityFeePerGas(): NumberLike {
        return this._maxPriorityFeePerGas;
    }
    public set maxPriorityFeePerGas(value: NumberLike) {
        this._maxPriorityFeePerGas = value;

        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _paymasterAndData: string = '0x';
    public get paymasterAndData(): string {
        return this._paymasterAndData;
    }
    public set paymasterAndData(value: string) {
        this._paymasterAndData = value;

        // update preVerificationGas & verificationGasLimit
        this.updateVerificationGasLimit();
        this.updatePreVerificationGas();
    }
    private _signature: string = '0x';
    public get signature(): string {
        return this._signature;
    }
    public set signature(value: string) {
        this._signature = value;
    }



    /**
     * @description convert to userOperation tuple string
     * @returns {string} the userOperation tuple string
     */
    public toTuple(): string {
        /* 
        address sender;
        uint256 nonce;
        bytes initCode;
        bytes callData;
        uint callGas;
        uint verificationGas;
        uint preVerificationGas;
        uint maxFeePerGas;
        uint maxPriorityFeePerGas;
        address paymaster;
        bytes paymasterData;
        bytes signature;
        */
        return `["${this.sender.toLocaleLowerCase()}","${toDecString(this.nonce)}","${this.initCode}","${this.callData}","${toDecString(this.callGasLimit)}","${toDecString(this.verificationGasLimit)}","${toDecString(this.preVerificationGas)}","${toDecString(this.maxFeePerGas)}","${toDecString(this.maxPriorityFeePerGas)}","${this.paymasterAndData}","${this.signature}"]`;
    }

    /**
     * @description convert to userOperation struct
     * @returns {object} the userOperation struct
     */
    public getStruct() {
        this.alignment();
        return {
            sender: this.sender,
            nonce: this.nonce,
            initCode: this.initCode,
            callData: this.callData,
            callGasLimit: this.callGasLimit,
            verificationGasLimit: this.verificationGasLimit,
            preVerificationGas: this.preVerificationGas,
            maxFeePerGas: this.maxFeePerGas,
            maxPriorityFeePerGas: this.maxPriorityFeePerGas,
            paymasterAndData: this.paymasterAndData,
            signature: this.signature
        };
    }

    /**
     * @description convert NumberLike property to hex string
     * @returns {void}
     */
    public alignment() {
        this._nonce = toHexString(this._nonce);
        this._callGasLimit = toHexString(this._callGasLimit);
        this._verificationGasLimit = toHexString(this._verificationGasLimit);
        this._preVerificationGas = toHexString(this._preVerificationGas);
        this._maxFeePerGas = toHexString(this._maxFeePerGas);
        this._maxPriorityFeePerGas = toHexString(this._maxPriorityFeePerGas);
        this._paymasterAndData = this._paymasterAndData === AddressZero ? '0x' : this._paymasterAndData;
    }

    /**
     * @description convert to userOperation json string
     * @returns {string} the userOperation json string
     */
    public toJSON(): string {
        this.alignment();
        return JSON.stringify({
            sender: this.sender,
            nonce: this.nonce,
            initCode: this.initCode,
            callData: this.callData,
            callGasLimit: this.callGasLimit,
            verificationGasLimit: this.verificationGasLimit,
            preVerificationGas: this.preVerificationGas,
            maxFeePerGas: this.maxFeePerGas,
            maxPriorityFeePerGas: this.maxPriorityFeePerGas,
            paymasterAndData: this.paymasterAndData,
            signature: this.signature
        });
    }

    /**
     * @description convert from userOperation json string
     * @param {string} json the userOperation json string
     * @returns {UserOperation} the userOperation object
     */
    public static fromJSON(json: string): UserOperation {
        const obj = JSON.parse(json);
        if (!obj || typeof obj !== 'object') {
            throw new Error('invalid json');
        }
        if (typeof obj.sender !== 'string') {
            throw new Error('invalid sender');
        }
        if (typeof obj.nonce !== 'string' && typeof obj.nonce !== 'number') {
            throw new Error('invalid nonce');
        }
        if (typeof obj.initCode !== 'string' || !obj.initCode.startsWith('0x')) {
            throw new Error('invalid initCode');
        }
        if (typeof obj.callData !== 'string' || !obj.callData.startsWith('0x')) {
            throw new Error('invalid callData');
        }
        if (typeof obj.callGasLimit !== 'string' && typeof obj.callGasLimit !== 'number') {
            throw new Error('invalid callGasLimit');
        }
        if (typeof obj.verificationGasLimit !== 'string' && typeof obj.verificationGasLimit !== 'number') {
            throw new Error('invalid verificationGasLimit');
        }
        if (typeof obj.preVerificationGas !== 'string' && typeof obj.preVerificationGas !== 'number') {
            throw new Error('invalid preVerificationGas');
        }
        if (typeof obj.maxFeePerGas !== 'string' && typeof obj.maxFeePerGas !== 'number') {
            throw new Error('invalid maxFeePerGas');
        }
        if (typeof obj.maxPriorityFeePerGas !== 'string' && typeof obj.maxPriorityFeePerGas !== 'number') {
            throw new Error('invalid maxPriorityFeePerGas');
        }
        if (typeof obj.paymasterAndData !== 'string' || !obj.paymasterAndData.startsWith('0x')) {
            throw new Error('invalid paymasterAndData');
        }
        if (typeof obj.signature !== 'string' || !obj.signature.startsWith('0x')) {
            throw new Error('invalid signature');
        }

        const userOp = new UserOperation(obj.sender, obj.nonce, obj.initCode, obj.callData, obj.callGasLimit, obj.maxFeePerGas, obj.maxPriorityFeePerGas, obj.paymasterAndData, obj.verificationGasLimit, obj.preVerificationGas, obj.signature);
        return userOp;
    }



    /**
     * @description convert from userOperation object
     * @param {object} obj the userOperation object
     * @returns {UserOperation} the userOperation object
     */
    public static fromObject(obj: any): UserOperation {
        if (!obj || typeof obj !== 'object') {
            throw new Error('invalid json');
        }
        if (typeof obj.sender !== 'string') {
            throw new Error('invalid sender');
        }
        if (typeof obj.nonce !== 'string' && typeof obj.nonce !== 'number') {
            throw new Error('invalid nonce');
        }
        if (typeof obj.initCode !== 'string' || !obj.initCode.startsWith('0x')) {
            throw new Error('invalid initCode');
        }
        if (typeof obj.callData !== 'string' || !obj.callData.startsWith('0x')) {
            throw new Error('invalid callData');
        }
        if (typeof obj.callGasLimit !== 'string' && typeof obj.callGasLimit !== 'number') {
            throw new Error('invalid callGasLimit');
        }
        if (typeof obj.verificationGasLimit !== 'string' && typeof obj.verificationGasLimit !== 'number') {
            throw new Error('invalid verificationGasLimit');
        }
        if (typeof obj.preVerificationGas !== 'string' && typeof obj.preVerificationGas !== 'number') {
            throw new Error('invalid preVerificationGas');
        }
        if (typeof obj.maxFeePerGas !== 'string' && typeof obj.maxFeePerGas !== 'number') {
            throw new Error('invalid maxFeePerGas');
        }
        if (typeof obj.maxPriorityFeePerGas !== 'string' && typeof obj.maxPriorityFeePerGas !== 'number') {
            throw new Error('invalid maxPriorityFeePerGas');
        }
        if (typeof obj.paymasterAndData !== 'string' || !obj.paymasterAndData.startsWith('0x')) {
            throw new Error('invalid paymasterAndData');
        }
        if (typeof obj.signature !== 'string' || !obj.signature.startsWith('0x')) {
            throw new Error('invalid signature');
        }

        const userOp = new UserOperation(obj.sender, obj.nonce, obj.initCode, obj.callData, obj.callGasLimit, obj.maxFeePerGas, obj.maxPriorityFeePerGas, obj.paymasterAndData, obj.verificationGasLimit, obj.preVerificationGas, obj.signature);
        return userOp;
    }

    private recoveryWalletOP() {
        /**
          * if recovery wallet,preVerificationGas += 20000
          * 0x4fb2e45d:transferOwner(address)
          */
        return this.callData.startsWith('0x4fb2e45d');
    }

    private updatePreVerificationGas() {
        if (this._specifiedPreVerificationGas) {
            return;
        }
        try {

            let _preVerificationGas = this._userOp.callDataCost(this) + 10000;
            if (this.recoveryWalletOP()) {
                _preVerificationGas += 20000;
            }
            this._preVerificationGas = _preVerificationGas;
        } catch (error) {
            console.log(error);
        }
    }

    private updateVerificationGasLimit() {
        if (this._specifiedVerificationGasLimit) {
            return;
        }
        let _verificationGasLimit = 50000;
        if (this.recoveryWalletOP()) {
            _verificationGasLimit += 550000; // create guardian cost
        }
        if (this._initCode !== '0x') {
            _verificationGasLimit += 400000; // create wallet cost
        }
        if (this.paymasterAndData.length >= 42 && this.paymasterAndData !== AddressZero) {
            _verificationGasLimit += 50000; // paymaster cost ( validatePaymasterUserOp & postOp )
        }
        this._verificationGasLimit = _verificationGasLimit;
    }



    /**
     * @description estimate gas
     * @param {string} entryPointAddress the entry point address
     * @param {ethers.providers.BaseProvider} etherProvider the ethers.js provider e.g. ethers.provider
     * @returns {Promise<boolean>} true or false
     */
    public async estimateGas(
        entryPointAddress: string,
        etherProvider: ethers.providers.BaseProvider
        // estimateGasFunc: (txInfo: ethers.utils.Deferrable<ethers.providers.TransactionRequest>) => Promise<BigNumber> //(transaction:ethers.providers.TransactionRequest):Promise<number>
        // (transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>): Promise<ether.BigNumber>
    ) {
        try {
            const estimateGasRe = await etherProvider.estimateGas({
                from: entryPointAddress,
                to: this.sender,
                data: this.callData,
                gasLimit: 20000000
            });

            this.callGasLimit = estimateGasRe.toNumber();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    /**
     * @description get the paymaster sign hash
     * @returns {string} the paymaster sign hash
     */
    public payMasterSignHash(): string {
        return this._userOp.payMasterSignHash(this);
    }

    /**
     * @description sign the user operation
     * @param {string} entryPoint the entry point address
     * @param {number} chainId the chain id
     * @param {string} privateKey the private key
     * @returns {void}
     */
    public sign(
        entryPoint: string,
        chainId: number,
        privateKey: string): void {
        this.signature = this._userOp.signUserOp(this, entryPoint, chainId, privateKey);
    }


    /**
     * @description sign the user operation with signature
     * @param {string} signAddress the sign address
     * @param {string} signature the signature
     * @returns {void}
     */
    public signWithSignature(signAddress: string, signature: string) {
        this.signature = this._userOp.signUserOpWithPersonalSign(signAddress, signature);
    }


    /**
     * @description get the UserOpHash (userOp hash)
     * @param {string} entryPointAddress the entry point address
     * @param {number} chainId the chain id
     * @returns {string} the UserOpHash (userOp hash)
     */
    public getUserOpHash(entryPointAddress: string, chainId: number): string {
        return this._userOp.getUserOpHash(this, entryPointAddress, chainId);
    }

    /**
     * @description get the UserOpHash (userOp hash) with deadline
     * @param {string} entryPointAddress the entry point address
     * @param {number} chainId the chain id
     * @param {number} deadline the deadline
     * @returns {string} the UserOpHash (userOp hash) with deadline
     * @remarks deadline is a timestamp in seconds
     */
    public getUserOpHashWithDeadline(entryPointAddress: string, chainId: number, deadline: number): string {
        const _hash = this.getUserOpHash(entryPointAddress, chainId);
        return ethers.utils.solidityKeccak256(['bytes32', 'uint64'], [_hash, deadline]);
    }

    /**
     * @description get the required prefund
     * @param {(BigNumber | NumberLike)?} basefee the basefee
     * @returns {BigNumber} the required prefund
     */
    public requiredPrefund(basefee?: BigNumber | NumberLike): BigNumber {
        /* 
         uint256 maxFeePerGas = mUserOp.maxFeePerGas;
        uint256 maxPriorityFeePerGas = mUserOp.maxPriorityFeePerGas;
        if (maxFeePerGas == maxPriorityFeePerGas) {
            //legacy mode (for networks that don't support basefee opcode)
            return maxFeePerGas;
        }
        return min(maxFeePerGas, maxPriorityFeePerGas + block.basefee);
        */
        let gasPrice: BigNumber;
        const maxFeePerGas = BigNumber.from(this.maxFeePerGas);
        const maxPriorityFeePerGas = BigNumber.from(this.maxPriorityFeePerGas);
        if (maxFeePerGas.eq(maxPriorityFeePerGas)) {
            gasPrice = maxFeePerGas;
        } else {
            if (basefee !== undefined) {
                basefee = BigNumber.from(basefee);
                const _fee = basefee.add(maxPriorityFeePerGas);
                gasPrice = _fee.gt(maxFeePerGas) ? maxFeePerGas : _fee;
            } else {
                gasPrice = maxFeePerGas;
            }
        }

        /* 
       //when using a Paymaster, the verificationGasLimit is used also to as a limit for the postOp call.
       // our security model might call postOp eventually twice
       uint256 mul = mUserOp.paymaster != address(0) ? 3 : 1;
       uint256 requiredGas = mUserOp.callGasLimit + mUserOp.verificationGasLimit * mul + mUserOp.preVerificationGas;

       // TODO: copy logic of gasPrice?
       requiredPrefund = requiredGas * getUserOpGasPrice(mUserOp);
       */
        const noPaymaster = this.paymasterAndData === AddressZero || this.paymasterAndData === '0x';
        const mul = noPaymaster ? 1 : 3;
        const requiredGas = BigNumber.from(this.callGasLimit).add(BigNumber.from(this.verificationGasLimit).mul(mul)).add(BigNumber.from(this.preVerificationGas));
        const requiredPrefund = requiredGas.mul(gasPrice);

        return requiredPrefund;
    }

}

export { UserOperation };