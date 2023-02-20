"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-04 23:45:24
 * @LastEditors: cejay
 * @LastEditTime: 2023-02-20 19:29:55
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProxyContract = void 0;
const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "logic",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];
const bytecode = '0x60806040526103b480380380610014816100bd565b92833981016040828203126100a1578151916001600160a01b03831683036100a1576020810151906001600160401b0382116100a157019181601f840112156100a15782519261006b610066856100ef565b6100bd565b92848452602085830101116100a1576100939361008e9160208086019101610119565b61013c565b60405160bb90816102f98239f35b600080fd5b50634e487b7160e01b600052604160045260246000fd5b6040519190601f01601f191682016001600160401b038111838210176100e257604052565b6100ea6100a6565b604052565b6020906001600160401b03811161010c575b601f01601f19160190565b6101146100a6565b610101565b60005b83811061012c5750506000910152565b818101518382015260200161011c565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc81905561021f91906000906001600160a01b0381167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8380a26040519282908190606086016001600160401b0381118782101761022b575b604052602786527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c6020870152660819985a5b195960ca1b6040870152602081519101845af4903d15610222573d61020f610066826100ef565b908152809360203d92013e610284565b50565b60609250610284565b6102336100a6565b6101b5565b1561023f57565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b919290156102a75750815115610298575090565b6102a4903b1515610238565b90565b8251909150156102ba5750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526102ea8151809281602486015260208686019101610119565b601f01601f19168101030190fdfe608060405236156049577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546000808092368280378136915af43d82803e156045573d90f35b3d90fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546000808092368280378136915af43d82803e156045573d90f3fea26469706673582212208a4a41d74ed71596076de03411c7eacbc19cc0695dad2a7906895be5aeaa62e864736f6c63430008110033';
const contract = {
    ABI,
    bytecode
};
exports.WalletProxyContract = contract;
//# sourceMappingURL=walletProxy.js.map