"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-07 21:08:08
 * @LastEditors: cejay
 * @LastEditTime: 2023-02-12 22:30:25
 */
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
exports.Converter = void 0;
const userOperation_1 = require("../entity/userOperation");
const ABI_1 = require("../defines/ABI");
const ethers_1 = require("ethers");
class Converter {
    constructor() {
    }
    fromTransaction(
    // etherProvider: ethers.providers.BaseProvider,
    // entryPointAddress: string,
    transcations, nonce = 0, maxFeePerGas = 0, maxPriorityFeePerGas = 0, paymasterAndData = "0x") {
        return __awaiter(this, void 0, void 0, function* () {
            const op = new userOperation_1.UserOperation();
            op.nonce = nonce;
            op.paymasterAndData = paymasterAndData;
            op.maxFeePerGas = maxFeePerGas;
            op.maxPriorityFeePerGas = maxPriorityFeePerGas;
            if (transcations.length === 0) {
                throw new Error("transcation is empty");
            }
            op.sender = (transcations[0].from).toLowerCase();
            // #TODO if gas is null
            let _callGasLimit = ethers_1.BigNumber.from(transcations[0].gas);
            const _to = [transcations[0].to];
            const _value = [transcations[0].value];
            const _data = [transcations[0].data];
            if (transcations.length > 1) {
                for (let i = 1; i < transcations.length; i++) {
                    _callGasLimit.add(ethers_1.BigNumber.from(transcations[i]));
                    _to.push(transcations[i].to);
                    _value.push(transcations[i].value);
                    _data.push(transcations[i].data);
                    if (op.sender !== transcations[i].from.toLowerCase()) {
                        throw new Error("transcation sender is not same");
                    }
                }
            }
            op.callGasLimit = _callGasLimit.toHexString();
            if (transcations.length === 1) {
                op.callData = new ethers_1.ethers.utils.Interface(ABI_1.execFromEntryPoint)
                    .encodeFunctionData("execFromEntryPoint", [_to[0], _value[0], _data[0]]);
            }
            else {
                op.callData = new ethers_1.ethers.utils.Interface(ABI_1.execBatchFromEntryPoint)
                    .encodeFunctionData("execFromEntryPoint", [_to, _value, _data]);
            }
            // let gasEstimated = await op.estimateGas(entryPointAddress,
            //     etherProvider
            // );
            // if (!gasEstimated) {
            //     return null;
            // }
            return op;
        });
    }
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map