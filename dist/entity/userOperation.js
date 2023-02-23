"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperation = void 0;
const ethers_1 = require("ethers");
const address_1 = require("../defines/address");
const numberLike_1 = require("../defines/numberLike");
const userOp_1 = require("../utils/userOp");
/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol
 */
class UserOperation {
    constructor() {
        this._sender = '';
        this._nonce = 0;
        this._initCode = '0x';
        this._callData = '0x';
        this._callGasLimit = 0;
        this._verificationGasLimit = 450000;
        this._preVerificationGas = 47000;
        this._maxFeePerGas = 0;
        this._maxPriorityFeePerGas = 0;
        this._paymasterAndData = '0x';
        this._signature = '0x';
        this._userOp = new userOp_1.UserOp();
    }
    get sender() {
        return this._sender;
    }
    set sender(value) {
        if (!ethers_1.ethers.utils.isAddress(value)) {
            throw new Error('invalid sender address');
        }
        this._sender = value;
    }
    get nonce() {
        return this._nonce;
    }
    set nonce(value) {
        this._nonce = value;
    }
    get initCode() {
        return this._initCode;
    }
    set initCode(value) {
        this._initCode = value;
        // update preVerificationGas & verificationGasLimit
        this.calcGas();
    }
    get callData() {
        return this._callData;
    }
    set callData(value) {
        this._callData = value;
        // update preVerificationGas & verificationGasLimit
        this.calcGas();
    }
    get callGasLimit() {
        return this._callGasLimit;
    }
    set callGasLimit(value) {
        this._callGasLimit = value;
    }
    get verificationGasLimit() {
        return this._verificationGasLimit;
    }
    set verificationGasLimit(value) {
        this._verificationGasLimit = value;
    }
    get preVerificationGas() {
        return this._preVerificationGas;
    }
    set preVerificationGas(value) {
        this._preVerificationGas = value;
    }
    get maxFeePerGas() {
        return this._maxFeePerGas;
    }
    set maxFeePerGas(value) {
        this._maxFeePerGas = value;
    }
    get maxPriorityFeePerGas() {
        return this._maxPriorityFeePerGas;
    }
    set maxPriorityFeePerGas(value) {
        this._maxPriorityFeePerGas = value;
    }
    get paymasterAndData() {
        return this._paymasterAndData;
    }
    set paymasterAndData(value) {
        this._paymasterAndData = value;
        // update preVerificationGas & verificationGasLimit
        this.calcGas();
    }
    get signature() {
        return this._signature;
    }
    set signature(value) {
        this._signature = value;
    }
    toTuple() {
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
        return `["${this.sender.toLocaleLowerCase()}","${(0, numberLike_1.toDecString)(this.nonce)}","${this.initCode}","${this.callData}","${(0, numberLike_1.toDecString)(this.callGasLimit)}","${(0, numberLike_1.toDecString)(this.verificationGasLimit)}","${(0, numberLike_1.toDecString)(this.preVerificationGas)}","${(0, numberLike_1.toDecString)(this.maxFeePerGas)}","${(0, numberLike_1.toDecString)(this.maxPriorityFeePerGas)}","${this.paymasterAndData}","${this.signature}"]`;
    }
    getStruct() {
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
    alignment() {
        this._nonce = (0, numberLike_1.toHexString)(this._nonce);
        this._callGasLimit = (0, numberLike_1.toHexString)(this._callGasLimit);
        this._verificationGasLimit = (0, numberLike_1.toHexString)(this._verificationGasLimit);
        this._preVerificationGas = (0, numberLike_1.toHexString)(this._preVerificationGas);
        this._maxFeePerGas = (0, numberLike_1.toHexString)(this._maxFeePerGas);
        this._maxPriorityFeePerGas = (0, numberLike_1.toHexString)(this._maxPriorityFeePerGas);
        this._paymasterAndData = this._paymasterAndData === address_1.AddressZero ? '0x' : this._paymasterAndData;
    }
    toJSON() {
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
    static fromJSON(json) {
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
        const userOp = new UserOperation();
        userOp.sender = obj.sender;
        userOp.nonce = obj.nonce;
        userOp.initCode = obj.initCode;
        userOp.callData = obj.callData;
        userOp.callGasLimit = obj.callGasLimit;
        userOp.verificationGasLimit = obj.verificationGasLimit;
        userOp.preVerificationGas = obj.preVerificationGas;
        userOp.maxFeePerGas = obj.maxFeePerGas;
        userOp.maxPriorityFeePerGas = obj.maxPriorityFeePerGas;
        userOp.paymasterAndData = obj.paymasterAndData;
        userOp.signature = obj.signature;
        return userOp;
    }
    static fromObject(obj) {
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
        const userOp = new UserOperation();
        userOp.sender = obj.sender;
        userOp.nonce = obj.nonce;
        userOp.initCode = obj.initCode;
        userOp.callData = obj.callData;
        userOp.callGasLimit = obj.callGasLimit;
        userOp.verificationGasLimit = obj.verificationGasLimit;
        userOp.preVerificationGas = obj.preVerificationGas;
        userOp.maxFeePerGas = obj.maxFeePerGas;
        userOp.maxPriorityFeePerGas = obj.maxPriorityFeePerGas;
        userOp.paymasterAndData = obj.paymasterAndData;
        userOp.signature = obj.signature;
        return userOp;
    }
    calcGas() {
        /**
        * if recovery wallet,preVerificationGas += 20000
        * 0x4fb2e45d:transferOwner(address)
        */
        let isRecoveryWallet = false;
        if (this.callData.startsWith('0x4fb2e45d')) {
            isRecoveryWallet = true;
        }
        // #region preVerificationGas
        let _preVerificationGas = this._userOp.callDataCost(this) + 10000;
        if (isRecoveryWallet) {
            _preVerificationGas += 20000;
        }
        this.preVerificationGas = _preVerificationGas;
        // #endregion preVerificationGas
        // #region verificationGasLimit
        let _verificationGasLimit = 50000;
        if (isRecoveryWallet) {
            _verificationGasLimit += 500000; // create guardian cost
        }
        if (this._initCode !== '0x') {
            _verificationGasLimit += 400000; // create wallet cost
        }
        if (this.paymasterAndData.length > 2 && this.paymasterAndData !== address_1.AddressZero) {
            _verificationGasLimit += 20000; // paymaster cost ( validatePaymasterUserOp & postOp )
        }
        this.verificationGasLimit = _verificationGasLimit;
        // #endregion verificationGasLimit
    }
    /**
     * estimate the gas
     * @param entryPointAddress the entry point address
     * @param estimateGasFunc the estimate gas function
     * @returns false if failed
     */
    estimateGas(entryPointAddress, etherProvider
    // estimateGasFunc: (txInfo: ethers.utils.Deferrable<ethers.providers.TransactionRequest>) => Promise<BigNumber> //(transaction:ethers.providers.TransactionRequest):Promise<number>
    // (transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>): Promise<ether.BigNumber>
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estimateGasRe = yield etherProvider.estimateGas({
                    from: entryPointAddress,
                    to: this.sender,
                    data: this.callData,
                    gasLimit: 20000000
                });
                this.callGasLimit = estimateGasRe.toNumber();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    /**
     * get the paymaster sign hash
     * @returns
     */
    payMasterSignHash() {
        return this._userOp.payMasterSignHash(this);
    }
    /**
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    sign(entryPoint, chainId, privateKey) {
        this.signature = this._userOp.signUserOp(this, entryPoint, chainId, privateKey);
    }
    /**
     * sign the user operation with personal sign
     * @param signAddress the sign address
     * @param signature the signature of the UserOpHash
     */
    signWithSignature(signAddress, signature) {
        this.signature = this._userOp.signUserOpWithPersonalSign(signAddress, signature);
    }
    /**
     * get the UserOpHash (userOp hash)
     * @param entryPointAddress the entry point address
     * @param chainId the chain id
     * @returns hex string
     */
    getUserOpHash(entryPointAddress, chainId) {
        return this._userOp.getUserOpHash(this, entryPointAddress, chainId);
    }
    /**
     * get the UserOpHash (userOp hash) with deadline
     * @param entryPointAddress
     * @param chainId
     * @param deadline unix timestamp
     * @returns bytes32 hash
     */
    getUserOpHashWithDeadline(entryPointAddress, chainId, deadline) {
        const _hash = this.getUserOpHash(entryPointAddress, chainId);
        return ethers_1.ethers.utils.solidityKeccak256(['bytes32', 'uint64'], [_hash, deadline]);
    }
    /**
     * get required pre fund
     * @param basefee for EIP1559, the basefee
     * @returns required pre fund
     */
    requiredPrefund(basefee) {
        /*
         uint256 maxFeePerGas = mUserOp.maxFeePerGas;
        uint256 maxPriorityFeePerGas = mUserOp.maxPriorityFeePerGas;
        if (maxFeePerGas == maxPriorityFeePerGas) {
            //legacy mode (for networks that don't support basefee opcode)
            return maxFeePerGas;
        }
        return min(maxFeePerGas, maxPriorityFeePerGas + block.basefee);
        */
        let gasPrice;
        const maxFeePerGas = ethers_1.BigNumber.from(this.maxFeePerGas);
        const maxPriorityFeePerGas = ethers_1.BigNumber.from(this.maxPriorityFeePerGas);
        if (maxFeePerGas.eq(maxPriorityFeePerGas)) {
            gasPrice = maxFeePerGas;
        }
        else {
            if (basefee !== undefined) {
                basefee = ethers_1.BigNumber.from(basefee);
                const _fee = basefee.add(maxPriorityFeePerGas);
                gasPrice = _fee.gt(maxFeePerGas) ? maxFeePerGas : _fee;
            }
            else {
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
        const noPaymaster = this.paymasterAndData === address_1.AddressZero || this.paymasterAndData === '0x';
        const mul = noPaymaster ? 1 : 3;
        const requiredGas = ethers_1.BigNumber.from(this.callGasLimit).add(ethers_1.BigNumber.from(this.verificationGasLimit).mul(mul)).add(ethers_1.BigNumber.from(this.preVerificationGas));
        const requiredPrefund = requiredGas.mul(gasPrice);
        return requiredPrefund;
    }
}
exports.UserOperation = UserOperation;
//# sourceMappingURL=userOperation.js.map