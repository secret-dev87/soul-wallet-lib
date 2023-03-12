"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletFactoryContract = void 0;
const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_walletImpl",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_singletonFactory",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_proxy",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_implementation",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "version",
                "type": "string"
            }
        ],
        "name": "SoulWalletCreated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "VERSION",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_entryPoint",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "_upgradeDelay",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "_guardianDelay",
                "type": "uint32"
            },
            {
                "internalType": "address",
                "name": "_guardian",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_salt",
                "type": "bytes32"
            }
        ],
        "name": "createWallet",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_entryPoint",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "_upgradeDelay",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "_guardianDelay",
                "type": "uint32"
            },
            {
                "internalType": "address",
                "name": "_guardian",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_salt",
                "type": "bytes32"
            }
        ],
        "name": "getWalletAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isWalletActive",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proxyCode",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "singletonFactory",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "walletImpl",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const bytecode = '0x60c03461012b57601f61121e38819003918201601f19168301916001600160401b0383118484101761013057808492604094855283398101031261012b57610052602061004b83610146565b9201610146565b906001600160a01b0390818116156100f3576080528116156100ae5760a0526040516110c3908161015b8239608051818181610182015281816105580152610663015260a05181818161027d015281816104a801526106e30152f35b60405162461bcd60e51b815260206004820152601660248201527f73696e676c65746f6e466163746f7279206572726f72000000000000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601060248201526f3bb0b63632ba24b6b8361032b93937b960811b6044820152606490fd5b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361012b5756fe60406080815260043610156200001457600080fd5b600090813560e01c806330b8d376146200057c5780633943c030146200050c5780636fa59bbc14620004cc578063bc10273e146200045c578063d0ed7b9114620003f0578063f452880814620000cf5763ffa1ad74146200007457600080fd5b34620000cb57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112620000cb57620000c790620000b362000884565b9051918291602083526020830190620007ce565b0390f35b5080fd5b509034620003ed57620000e23662000712565b90969391969592956103b48551976020988993849283850162000106908462000813565b8483528383019462000926863989517f82778654000000000000000000000000000000000000000000000000000000008582015273ffffffffffffffffffffffffffffffffffffffff9b8c166024820152888c16604482015263ffffffff91821660648201529c1660848d0152891660a4808d01919091528b527f00000000000000000000000000000000000000000000000000000000000000009a8b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0620001d160c48462000813565b8a51809286820194620001e59186620008cf565b039081018252620001f7908262000813565b89519485935190818686016200020d92620007a9565b8301905191828583016200022192620007a9565b01038083520162000233908262000813565b8551809381927f4af63f02000000000000000000000000000000000000000000000000000000008352886004840152604483016200027191620007ce565b906024830152038186897f0000000000000000000000000000000000000000000000000000000000000000165af1908115620003e35790859184916200039e575b50169384156200034157847f8f4ebbea6fac3dc9485cb4581e23041567937fa082c34a8504307cd1b7ecc3da879886979862000308620002f162000884565b95808a519485948552169716958c830190620007ce565b0390a48381528085522060017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0082541617905551908152f35b6064868551907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152600e60248201527f63726561746532206661696c65640000000000000000000000000000000000006044820152fd5b809250878092503d8311620003db575b620003ba818362000813565b81010312620003d757518481168103620003d757849038620002b2565b8280fd5b503d620003ae565b84513d85823e3d90fd5b80fd5b5034620000cb5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112620000cb5760043573ffffffffffffffffffffffffffffffffffffffff8116809103620003d757818360ff926020955280855220541690519015158152f35b5034620000cb57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112620000cb576020905173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b5034620000cb57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112620000cb57620000c790620000b362000901565b5034620000cb57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112620000cb576020905173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b5034620000cb57600b90620006d26055620005973662000712565b93620005a99995979192939962000901565b89517f827786540000000000000000000000000000000000000000000000000000000060208083019190915273ffffffffffffffffffffffffffffffffffffffff9a8b166024830152928a16604482015263ffffffff9b8c16606482015294909a16608485015291871660a480850191909152835290979190887fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06200065160c48562000813565b620006968a51918262000689858201977f000000000000000000000000000000000000000000000000000000000000000089620008cf565b0390810183528262000813565b8951938491620006c584620006b5818601998a815193849201620007a9565b84019151809386840190620007a9565b0103808452018262000813565b5190209085519186830152868201527f000000000000000000000000000000000000000000000000000000000000000081520160ff815320915191168152f35b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc60c0910112620007a45773ffffffffffffffffffffffffffffffffffffffff6004358181168103620007a457916024358281168103620007a4579163ffffffff916044358381168103620007a457926064359081168103620007a457916084359081168103620007a4579060a43590565b600080fd5b60005b838110620007bd5750506000910152565b8181015183820152602001620007ac565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f6020936200080c81518092818752878088019101620007a9565b0116010190565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176200085557604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051906040820182811067ffffffffffffffff8211176200085557604052600582527f302e302e310000000000000000000000000000000000000000000000000000006020830152565b60409073ffffffffffffffffffffffffffffffffffffffff620008fe94931681528160208201520190620007ce565b90565b6040516103b462000916602082018362000813565b80825262000cda60208301399056fe60806040526103b480380380610014816100bd565b92833981016040828203126100a1578151916001600160a01b03831683036100a1576020810151906001600160401b0382116100a157019181601f840112156100a15782519261006b610066856100ef565b6100bd565b92848452602085830101116100a1576100939361008e9160208086019101610119565b61013c565b60405160bb90816102f98239f35b600080fd5b50634e487b7160e01b600052604160045260246000fd5b6040519190601f01601f191682016001600160401b038111838210176100e257604052565b6100ea6100a6565b604052565b6020906001600160401b03811161010c575b601f01601f19160190565b6101146100a6565b610101565b60005b83811061012c5750506000910152565b818101518382015260200161011c565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc81905561021f91906000906001600160a01b0381167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8380a26040519282908190606086016001600160401b0381118782101761022b575b604052602786527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c6020870152660819985a5b195960ca1b6040870152602081519101845af4903d15610222573d61020f610066826100ef565b908152809360203d92013e610284565b50565b60609250610284565b6102336100a6565b6101b5565b1561023f57565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b919290156102a75750815115610298575090565b6102a4903b1515610238565b90565b8251909150156102ba5750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526102ea8151809281602486015260208686019101610119565b601f01601f19168101030190fdfe608060405236156049577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546000808092368280378136915af43d82803e156045573d90f35b3d90fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546000808092368280378136915af43d82803e156045573d90f3fea26469706673582212208090d0af820f5b59d1da85476d8d46f49d4a89597f48aaa3b421c213ab65b52d64736f6c6343000811003360806040526103b480380380610014816100bd565b92833981016040828203126100a1578151916001600160a01b03831683036100a1576020810151906001600160401b0382116100a157019181601f840112156100a15782519261006b610066856100ef565b6100bd565b92848452602085830101116100a1576100939361008e9160208086019101610119565b61013c565b60405160bb90816102f98239f35b600080fd5b50634e487b7160e01b600052604160045260246000fd5b6040519190601f01601f191682016001600160401b038111838210176100e257604052565b6100ea6100a6565b604052565b6020906001600160401b03811161010c575b601f01601f19160190565b6101146100a6565b610101565b60005b83811061012c5750506000910152565b818101518382015260200161011c565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc81905561021f91906000906001600160a01b0381167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8380a26040519282908190606086016001600160401b0381118782101761022b575b604052602786527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c6020870152660819985a5b195960ca1b6040870152602081519101845af4903d15610222573d61020f610066826100ef565b908152809360203d92013e610284565b50565b60609250610284565b6102336100a6565b6101b5565b1561023f57565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b919290156102a75750815115610298575090565b6102a4903b1515610238565b90565b8251909150156102ba5750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526102ea8151809281602486015260208686019101610119565b601f01601f19168101030190fdfe608060405236156049577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546000808092368280378136915af43d82803e156045573d90f35b3d90fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546000808092368280378136915af43d82803e156045573d90f3fea26469706673582212208090d0af820f5b59d1da85476d8d46f49d4a89597f48aaa3b421c213ab65b52d64736f6c63430008110033a264697066735822122041ee5820ec255fbf9c72e056032e3b3fef4cdd5f88f6eea5c5d12455d77ec18464736f6c63430008110033';
const contract = {
    ABI,
    bytecode
};
exports.WalletFactoryContract = contract;
//# sourceMappingURL=walletFactory.js.map