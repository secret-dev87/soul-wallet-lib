import soulWalletBytes4 from './soulwalletBytes4.js';
import hotBytes4 from './hotBytes4.js';
import { TokenInfo, getAsset } from "@soulwallet/assets";
import { ABI_SoulWallet } from "@soulwallet/abi";
import { ResultWithErrors } from 'internal-interface';
import { DecodeResult, Method } from './interface/decodeData.js';
import { ethers } from 'ethers';
import { Bytes4 } from './interface/bytes4.js';

export class Decoder {

    /**
     * @Doc: Why use: async?
     *        May be use some online services in the future, 
     *        use the async keyword ensures that the interface signature will not need to change in the future.
     */
    public static async decode(chainId: number, from: string, to: string, calldata: string): Promise<ResultWithErrors<DecodeResult[], string>> {
        calldata = calldata.toLowerCase();

        const ret: DecodeResult[] = [];
        if (calldata.length < 10) {
            return new ResultWithErrors<DecodeResult[], string>(true, ret);
        }

        // get 4bytes from calldata
        const bytes4 = calldata.substring(0, 10);
        let _to: string[] = [];
        let _value: bigint[] = [];
        let _data: string[] = [];
        if (bytes4 === '0x18dfb3c7') {
            // b.set('0x18dfb3c7',{text:'executeBatch(address[],bytes[])',bytes4:'0x18dfb3c7'});
            const fun = soulWalletBytes4.get('0x18dfb3c7')!;
            const iface = new ethers.Interface(['function ' + fun.text]);
            const decodedData = iface.decodeFunctionData(fun.text.substring(0, fun.text.indexOf('(')), calldata);

            _to = decodedData[0];
            _data = decodedData[1];
        } else if (bytes4 === '0x47e1da2a') {
            // b.set('0x47e1da2a',{text:'executeBatch(address[],uint256[],bytes[])',bytes4:'0x47e1da2a'});
            const fun = soulWalletBytes4.get('0x47e1da2a')!;
            const iface = new ethers.Interface(['function ' + fun.text]);
            const decodedData = iface.decodeFunctionData(fun.text.substring(0, fun.text.indexOf('(')), calldata);

            _to = decodedData[0];
            _value = decodedData[1];
            _data = decodedData[2];
        } else if (bytes4 === '0xb61d27f6') {
            // b.set('0xb61d27f6',{text:'execute(address,uint256,bytes)',bytes4:'0xb61d27f6'});
            const fun = soulWalletBytes4.get('0xb61d27f6')!;
            const iface = new ethers.Interface(['function ' + fun.text]);
            const decodedData = iface.decodeFunctionData(fun.text.substring(0, fun.text.indexOf('(')), calldata);

            _to = [decodedData[0]];
            _value = [decodedData[1]];
            _data = [decodedData[2]];
        } else {
            _to = [to];
            _data = [calldata];
        }

        for (let i = 0; i < _to.length; i++) {
            const to = _to[i];
            let value = BigInt(0);
            if (_value.length > 0) {
                value = _value[i];
            }
            const data = _data[i];

            const decodeResult = await this.decodeItem(from, to, value, data, chainId);
            if (!decodeResult.succ) {
                return new ResultWithErrors<DecodeResult[], string>(false, undefined, decodeResult.errors);
            }
            ret.push(decodeResult.result!);
        }

        return new ResultWithErrors<DecodeResult[], string>(true, ret);
    }

    private static async decodeFunctionParams(calldata: string): Promise<ResultWithErrors<Method, string>> {
        if (calldata.length >= 10) {
            const bytes4 = calldata.substring(0, 10);
            let fun: Bytes4 | undefined = undefined;
            let _fun = soulWalletBytes4.get(bytes4);
            if (_fun) {
                fun = _fun;
            } else {
                _fun = hotBytes4.get(bytes4);
                if (_fun) {
                    fun = _fun;
                }
            }
            if (fun) {
                const iface = new ethers.Interface(['function ' + fun.text]);
                const name = fun.text.substring(0, fun.text.indexOf('('));
                const decodedData = iface.decodeFunctionData(name, calldata);
                if (decodedData) {
                    const method: Method = {
                        bytes4: bytes4,
                        name: name,
                        text: fun.text,
                        params: decodedData
                    }
                    return new ResultWithErrors<Method, string>(true, method);
                }
            }
        }
        return new ResultWithErrors<Method, string>(false, undefined, 'decodeFunctionParams error');
    }


    private static async decodeItem(from: string, to: string, value: bigint, calldata: string, chainId: number): Promise<ResultWithErrors<DecodeResult, string>> {
        const decodeResult: DecodeResult = {
            from: from,
            fromInfo: undefined,
            to: to,
            toInfo: undefined,
            value: value,
            method: undefined
        };

        const fromInfoRet = await getAsset(chainId, from);
        if (fromInfoRet.succ) {
            decodeResult.fromInfo = fromInfoRet.result!;
        }
        decodeResult.fromInfo = fromInfoRet.result!;

        const toInfoRet = await getAsset(chainId, to);
        if (toInfoRet.succ) {
            decodeResult.toInfo = toInfoRet.result!;
        }
        decodeResult.toInfo = toInfoRet.result!;

        const params = await this.decodeFunctionParams(calldata);
        if (params.succ) {
            decodeResult.method = params.result!;
        }

        return new ResultWithErrors<DecodeResult, string>(true, decodeResult);
    }




}