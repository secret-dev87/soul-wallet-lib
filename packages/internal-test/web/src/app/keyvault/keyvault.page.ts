import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Vault, VaultEvents, SignData, Ok, Err, Result } from '@soulwallet/keyvault';
import { SoulWallet } from '@soulwallet/sdk';
@Component({
  selector: 'app-keyvault',
  templateUrl: './keyvault.page.html',
  styleUrls: ['./keyvault.page.scss'],
})
export class KeyvaultPage implements OnInit {

  isInitialized: boolean = false;
  isLocked: boolean = false;
  Signers: string[] = [];

  password: string = 'password';
  privateKey: string = '0x4f7ef884a2fff8bcbfbe2377dd055e95acfae573a85d0217eb887b40c0ffa4d8';
  message: string = '0x426d3189d9ed64fbfab235f05d9a0e102d575939a951a93ec8bbdeef05cd707b';

  signData: Map<string, string> = new Map<string, string>();

  eventLog = '';


  vault: Vault;

  constructor(protected sanitizer: DomSanitizer) {
    this.vault = new Vault('default');
    /* 
      Initialized
      ReInitialized
      Locked
      Unlocked
      AccountAdded
      AccountRemoved
      Sign
      PersonalSign
      */
    this.vault.on('Initialized', () => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'Initialized<br/>-----<br/>';
    });
    this.vault.on('ReInitialized', () => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'ReInitialized<br/>-----<br/>';
    });

    this.vault.on('Locked', () => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'Locked<br/>-----<br/>';
    });

    this.vault.on('Unlocked', () => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'Unlocked<br/>-----<br/>';
    });

    this.vault.on('AccountAdded', (account: string) => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'AccountAdded:' + account + '<br/>-----<br/>';
    });

    this.vault.on('AccountRemoved', (account: string) => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'AccountRemoved:<br/>' + account + '<br/>-----<br/>';
    });

    this.vault.on('Sign', (signData: SignData) => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + '&nbsp;' + 'Sign:<br/>' + JSON.stringify(signData) + '<br/>-----<br/>';
    });

    this.vault.on('PersonalSign', (signData: SignData) => {
      const ts = "<font color='red'>" + new Date().toLocaleTimeString() + "</font>";
      this.eventLog += ts + 'PersonalSign' + JSON.stringify(signData) + '<br/>-----<br/>';
    });
  }

  async ngOnInit() {
    await this.reload();
  }

  async reload() {
    this.isInitialized = (await this.vault.isInitialized()).OK;
    this.isLocked = (await this.vault.isLocked()).OK;
    this.Signers = (await this.vault.listSigners()).OK;
  }

  async init(enforce: boolean) {

    const re = await this.vault.init(this.password, enforce);
    if (re.isErr() === true) {
      alert(re.ERR.message);
    }

    await this.reload();
  }

  async unlock() {
    const re = await this.vault.unlock(this.password);
    if (re.isErr() === true) {
      alert(re.ERR.message);
    }
    await this.reload();
  }

  async lock() {
    const re = await this.vault.lock();
    if (re.isErr() === true) {
      alert(re.ERR.message);
    }
    await this.reload();
  }

  async importSigner() {
    const re = await this.vault.importSigner(this.privateKey);
    if (re.isErr() === true) {
      alert(re.ERR.message);
    } else {
      alert('address:' + re.OK);
    }
    await this.reload();
  }

  async createSigner() {
    const re = await this.vault.createSigner();
    if (re.isErr() === true) {
      alert(re.ERR.message);
    } else {
      alert('address:' + re.OK);
    }
    await this.reload();
  }

  async removeSigner(signer: string) {
    const re = await this.vault.removeSigner(signer);
    if (re.isErr() === true) {
      alert(re.ERR.message);
    }
    await this.reload();
  }

  async sign(signer: string) {
    const re = await this.vault.rawSign(signer, this.message);
    if (re.isErr() === true) {
      alert(re.ERR.message);
    } else {
      this.signData.set(signer + 'raw', re.OK);
      alert('signature:' + re.OK);
    }
    await this.reload();
  }

  getRawSign(signer: string): string {
    const key = signer + 'raw';
    if (this.signData.has(key)) {
      return this.signData.get(key)!;
    } else {
      return '--';
    }
  }

  async personalSign(signer: string) {
    const re = await this.vault.personalSign(signer, this.message);
    if (re.isErr() === true) {
      alert(re.ERR.message);
    } else {
      this.signData.set(signer + 'personal', re.OK);
      alert('signature:' + re.OK);
    }
    await this.reload();
  }
  getPersonalSign(signer: string): string {
    const key = signer + 'personal';
    if (this.signData.has(key)) {
      return this.signData.get(key)!;
    } else {
      return '--';
    }
  }

  getEventLog(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.eventLog);
  }



}
