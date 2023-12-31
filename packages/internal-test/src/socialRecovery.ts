import { ethers } from "ethers";
import { L1KeyStore, SoulWallet } from "@soulwallet/sdk";

export class SocialRecovery {

    readonly provider: ethers.JsonRpcProvider;
    readonly L1KeyStoreAddress: string;

    constructor(
        _provider: string,
        _L1KeyStoreAddress: string) {
        this.provider = new ethers.JsonRpcProvider(_provider);
        this.L1KeyStoreAddress = _L1KeyStoreAddress;
    }




    async run(): Promise<void> {
        let _L1KeyStore: L1KeyStore = new L1KeyStore(this.provider, this.L1KeyStoreAddress);
        const initialKey = ethers.Wallet.createRandom();
        const guardians: ethers.HDNodeWallet[] = [];
        const guardianAddresses: string[] = [];
        const guardianCount = 10;
        const threshold = 5;
        for (let i = 0; i < guardianCount; i++) {
            const wallet = ethers.Wallet.createRandom();
            guardians.push(wallet);
            guardianAddresses.push(wallet.address);
        }
        const initialGuardianHash = L1KeyStore.calcGuardianHash(guardianAddresses, threshold);
        const slot = L1KeyStore.getSlot(L1KeyStore.addressToBytes32(initialKey.address), initialGuardianHash);

        {
            const _key = await _L1KeyStore.getKey(slot);
            if (_key.isErr() === true) {
                throw new Error(_key.ERR.message);
            }
            if (_key.OK != L1KeyStore.addressToBytes32(ethers.ZeroAddress)) {
                throw new Error('slot is already set');
            }

            const _slotInfo = await _L1KeyStore.getKeyStoreInfo(slot);
            if (_slotInfo.isErr() === true) {
                throw new Error(_slotInfo.ERR.message);
            }
            if (_slotInfo.OK.key != L1KeyStore.addressToBytes32(ethers.ZeroAddress)) {
                throw new Error('slot is already set');
            }
        }


        const keyRet = await _L1KeyStore.getKey(slot);
        if (keyRet.isErr() === true) {
            throw new Error(keyRet.ERR.message);
        }
        const key = keyRet.OK;
        if (key != L1KeyStore.addressToBytes32(ethers.ZeroAddress)) {
            throw new Error('slot is already set');
        }

        // snapshot
        const snapshotId: number = parseInt(await this.provider.send('evm_snapshot', []), 16);

        {
            // change key

        }




        const newKey1 = ethers.Wallet.createRandom();


        // revert to snapshotId
        await this.provider.send('evm_revert', [snapshotId]);


    }
}