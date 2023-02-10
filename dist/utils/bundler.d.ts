/// <reference types="node" />
import { ethers } from "ethers";
import { UserOperation } from "../entity/userOperation";
import EventEmitter from 'events';
export declare class ApiTimeOut {
    web3ApiRequestTimeout: number;
    web3ApiResponseTimeout: number;
    bundlerApiRequestTimeout: number;
    bundlerApiResponseTimeout: number;
}
export declare class Bundler {
    private _entryPoint;
    private _etherProvider;
    private _bundlerApi?;
    private _timeout;
    /**
     *
     * @param entryPoint the entry point address
     * @param etherProvider
     * @param bundlerApi the bundler api address(https)
     * @param timeout the timeout config
     */
    constructor(entryPoint: string, etherProvider: ethers.providers.BaseProvider, bundlerApi?: string, timeout?: ApiTimeOut);
    private _request;
    private _init;
    init(): Promise<void>;
    get Raw(): {
        eth_chainId: () => Promise<string>;
        eth_supportedEntryPoints: () => Promise<string[]>;
        eth_sendUserOperation: (userOp: UserOperation) => Promise<string>;
        eth_estimateUserOperationGas: (userOp: UserOperation) => Promise<void>;
        eth_getUserOperationReceipt: (userOpHash: string) => Promise<void>;
        eth_getUserOperationByHash: (userOpHash: string) => Promise<void>;
    };
    private eth_chainId;
    private eth_supportedEntryPoints;
    private eth_sendUserOperation;
    private eth_estimateUserOperationGas;
    private eth_getUserOperationReceipt;
    private eth_getUserOperationByHash;
    private _sendUserOperation;
    sendUserOperation(userOp: UserOperation): EventEmitter;
    simulateHandleOp(op: UserOperation): Promise<{
        preOpGas: any;
        paid: any;
        deadline: any;
        paymasterDeadline: any;
    }>;
    simulateValidation(op: UserOperation): Promise<{
        op: any;
        senderInfo: any;
        factoryInfo: any;
        paymasterInfo: any;
    }>;
}
