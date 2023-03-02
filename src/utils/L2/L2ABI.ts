/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2023-03-02 10:10:47
 * @LastEditors: cejay
 * @LastEditTime: 2023-03-02 10:15:35
 */
const ArbitrumNodeInterfaceABI = [
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "size",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "leaf",
                "type": "uint64"
            }
        ],
        "name": "constructOutboxProof",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "send",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "root",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "l2CallValue",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "excessFeeRefundAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "callValueRefundAddress",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "estimateRetryableTicket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "blockNum",
                "type": "uint64"
            }
        ],
        "name": "findBatchContainingBlock",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "batch",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "contractCreation",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "gasEstimateComponents",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "gasEstimate",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "gasEstimateForL1",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "baseFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "l1BaseFeeEstimate",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "contractCreation",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "gasEstimateL1Component",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "gasEstimateForL1",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "baseFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "l1BaseFeeEstimate",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "blockHash",
                "type": "bytes32"
            }
        ],
        "name": "getL1Confirmations",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "confirmations",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "batchNum",
                "type": "uint256"
            },
            {
                "internalType": "uint64",
                "name": "index",
                "type": "uint64"
            }
        ],
        "name": "legacyLookupMessageBatchProof",
        "outputs": [
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256",
                "name": "path",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "l2Sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "l1Dest",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "l2Block",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "l1Block",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "calldataForL1",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nitroGenesisBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "number",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
];


const OptimisticGasPriceOracleABI = [
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gasPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "getL1Fee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "getL1GasUsed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "l1BaseFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "overhead",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "scalar",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export { ArbitrumNodeInterfaceABI, OptimisticGasPriceOracleABI };