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
exports.ETH = exports.ERC1155 = exports.ERC721 = exports.ERC20 = exports.Token = void 0;
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 21:45:49
 * @LastEditors: cejay
 * @LastEditTime: 2023-02-09 18:42:50
 */
const userOperation_1 = require("../entity/userOperation");
const ABI_1 = require("../defines/ABI");
const ethers_1 = require("ethers");
class Token {
    createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAndData, maxFeePerGas, maxPriorityFeePerGas, callContract, encodeABI, value = '0') {
        return __awaiter(this, void 0, void 0, function* () {
            walletAddress = ethers_1.ethers.utils.getAddress(walletAddress);
            let userOperation = new userOperation_1.UserOperation();
            userOperation.nonce = nonce;
            userOperation.sender = walletAddress;
            userOperation.paymasterAndData = paymasterAndData;
            userOperation.maxFeePerGas = maxFeePerGas;
            userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
            userOperation.callData = new ethers_1.ethers.utils.Interface(ABI_1.execFromEntryPoint)
                .encodeFunctionData("execFromEntryPoint", [callContract, value, encodeABI]);
            let gasEstimated = yield userOperation.estimateGas(entryPointAddress, etherProvider);
            if (!gasEstimated) {
                return null;
            }
            return userOperation;
        });
    }
}
exports.Token = Token;
class ERC20 {
    constructor(singletonFactory) {
        this._token = new Token();
    }
    getContract(etherProvider, contractAddress) {
        return new ethers_1.ethers.Contract(contractAddress, ABI_1.ERC20, etherProvider);
    }
    approve(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _spender, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC20).encodeFunctionData("approve", [_spender, _value]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    getApproveCallData(etherProvider, walletAddress, _token, _spender, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC20).encodeFunctionData("approve", [_spender, _value]);
            let callGasLimit = yield etherProvider.estimateGas({
                from: walletAddress,
                to: _token,
                data: new ethers_1.ethers.utils.Interface(ABI_1.ERC20).encodeFunctionData("approve", [_spender, _value])
            });
            callGasLimit = callGasLimit.add(10000);
            const callData = new ethers_1.ethers.utils.Interface(ABI_1.execFromEntryPoint)
                .encodeFunctionData("execFromEntryPoint", [_token, 0, encodeABI]);
            return {
                callData,
                callGasLimit: callGasLimit.toHexString()
            };
        });
    }
    transferFrom(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _from, _to, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC20).encodeFunctionData("transferFrom", [_from, _to, _value]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    transfer(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _to, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC20).encodeFunctionData("transfer", [_to, _value]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
}
exports.ERC20 = ERC20;
class ERC721 {
    constructor(singletonFactory) {
        this._token = new Token();
    }
    getContract(etherProvider, contractAddress) {
        return new ethers_1.ethers.Contract(contractAddress, ABI_1.ERC721, etherProvider);
    }
    approve(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _spender, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC721).encodeFunctionData("approve", [_spender, _tokenId]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    transferFrom(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _from, _to, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC721).encodeFunctionData("transferFrom", [_from, _to, _tokenId]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    transfer(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _to, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC721).encodeFunctionData("transfer", [_to, _tokenId]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    safeTransferFrom(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _from, _to, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC721).encodeFunctionData("safeTransferFrom", [_from, _to, _tokenId]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    setApprovalForAll(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _operator, _approved) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC721).encodeFunctionData("setApprovalForAll", [_operator, _approved]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
}
exports.ERC721 = ERC721;
class ERC1155 {
    constructor(singletonFactory) {
        this._token = new Token();
    }
    getContract(etherProvider, contractAddress) {
        return new ethers_1.ethers.Contract(contractAddress, ABI_1.ERC1155, etherProvider);
    }
    safeTransferFrom(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _from, _to, _id, _value, _data) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC1155).encodeFunctionData("safeTransferFrom", [_from, _to, _id, _value, _data]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    safeBatchTransferFrom(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _from, _to, _ids, _values, _data) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC1155).encodeFunctionData("safeBatchTransferFrom", [_from, _to, _ids, _values, _data]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
    setApprovalForAll(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, _operator, _approved) {
        return __awaiter(this, void 0, void 0, function* () {
            let encodeABI = new ethers_1.ethers.utils.Interface(ABI_1.ERC1155).encodeFunctionData("setApprovalForAll", [_operator, _approved]);
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, _token, encodeABI);
        });
    }
}
exports.ERC1155 = ERC1155;
class ETH {
    constructor(singletonFactory) {
        this._token = new Token();
    }
    transfer(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, to, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._token.createOp(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, to, '0x', value);
        });
    }
}
exports.ETH = ETH;
//# sourceMappingURL=token.js.map