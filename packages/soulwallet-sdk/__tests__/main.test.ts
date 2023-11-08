import { TypedDataDomain, TypedDataField, ethers } from 'ethers';
import {
    SoulWallet,
    UserOperation,
    UserOpUtils,
    UserOpErrors,
    UserOpErrorCodes,
    L1KeyStore,
    Ok, Err, Result,
    UserOpReceipt,
    UserOpDetail,
    UserOpGas,
    Bundler,
    Transaction,
    KeyStoreInfo,
    GuardianSignature,
    KeyStoreTypedDataType,
    InitialKey,
    ECCPoint,
    SignkeyType,
    P256Lib,
    WebAuthN,
    Base64Url
} from '..';
import { describe, expect, test } from '@jest/globals';
import { webcrypto } from 'node:crypto';
import { Hex } from '../src/tools/hex';
import {
    randomBytes
} from 'crypto';

describe('SDK', () => {
    test('P256Lib', () => {
        //uint256 Qx = uint256(0xe89e8b4be943fadb4dc599fe2e8af87a79b438adde328a3b72d43324506cd5b6);
        //uint256 Qy = uint256(0x4fbfe4a2f9934783c3b1af712ee87abc08f576e79346efc3b8355d931bd7b976);
        const point = P256Lib.ec_recover_r1(
            BigInt('0x180be1152bd871c82ea73f39977963ee157e10fbfff9d7252e324449b3a08848'),
            BigInt(28),
            BigInt('0x2ae3ddfe4cc414dc0fad7ff3a5c960d1cee1211722d3099ade76e5ac1826731a'),
            BigInt('0x87e5d654f357e4cd6cb52512b2da4d91eae0ae48e9d892ce532b9352f63a55d6')
        );
        expect(point.x).toBe(BigInt('0xe89e8b4be943fadb4dc599fe2e8af87a79b438adde328a3b72d43324506cd5b6'));
        expect(point.y).toBe(BigInt('0x4fbfe4a2f9934783c3b1af712ee87abc08f576e79346efc3b8355d931bd7b976'));
    });
    test('WebAuthN-recover', () => {
        // recover(rawMessage: string, r: string, s: string)
        const p = WebAuthN.recover('0x180be1152bd871c82ea73f39977963ee157e10fbfff9d7252e324449b3a08848', '0x2ae3ddfe4cc414dc0fad7ff3a5c960d1cee1211722d3099ade76e5ac1826731a', '0x87e5d654f357e4cd6cb52512b2da4d91eae0ae48e9d892ce532b9352f63a55d6');
        expect(p[1].x).toBe('0xe89e8b4be943fadb4dc599fe2e8af87a79b438adde328a3b72d43324506cd5b6');
        expect(p[1].y).toBe('0x4fbfe4a2f9934783c3b1af712ee87abc08f576e79346efc3b8355d931bd7b976');
    });
    test('WebAuthN-recoverWebAuthN', () => {
        // recover(rawMessage: string, r: string, s: string)
        const p = WebAuthN.recoverWebAuthN('0x83714056da6e6910b51595330c2c2cdfbf718f2deff5bdd84b95df7a7f36f6dd', '0x2ae3ddfe4cc414dc0fad7ff3a5c960d1cee1211722d3099ade76e5ac1826731a', '0x87e5d654f357e4cd6cb52512b2da4d91eae0ae48e9d892ce532b9352f63a55d6', '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000', "\",\"origin\":\"http://localhost:5500\",\"crossOrigin\":false}");
        expect(p[1].x).toBe('0xe89e8b4be943fadb4dc599fe2e8af87a79b438adde328a3b72d43324506cd5b6');
        expect(p[1].y).toBe('0x4fbfe4a2f9934783c3b1af712ee87abc08f576e79346efc3b8355d931bd7b976');
    });
    test('packUserOpP256Signature', async () => {
        const soulwallet = new SoulWallet('https://localhost/', 'https://localhost/', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');
        const signature = await soulwallet.packUserOpP256Signature({
            messageHash: '0x83714056da6e6910b51595330c2c2cdfbf718f2deff5bdd84b95df7a7f36f6dd',
            publicKey: {
                x: '0xe89e8b4be943fadb4dc599fe2e8af87a79b438adde328a3b72d43324506cd5b6',
                y: '0x4fbfe4a2f9934783c3b1af712ee87abc08f576e79346efc3b8355d931bd7b976'
            },
            r: '0x2ae3ddfe4cc414dc0fad7ff3a5c960d1cee1211722d3099ade76e5ac1826731a',
            s: '0x87e5d654f357e4cd6cb52512b2da4d91eae0ae48e9d892ce532b9352f63a55d6',
            authenticatorData: '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
            clientDataSuffix: '","origin":"http://localhost:5500","crossOrigin":false}'
        }, '0x00', undefined);
        expect(signature.isOk()).toBe(true);
        const expectSignature = '0x0002' + '00'/* type=P256 */ + '2ae3ddfe4cc414dc0fad7ff3a5c960d1cee1211722d3099ade76e5ac1826731a87e5d654f357e4cd6cb52512b2da4d91eae0ae48e9d892ce532b9352f63a55d61c0025000049960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a35353030222c2263726f73734f726967696e223a66616c73657d';
        expect(signature.OK).toBe(expectSignature);
    });

    test('packUserOpP256Signature-1', async () => {
        const soulwallet = new SoulWallet('https://localhost/', 'https://localhost/', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');
        const signature = await soulwallet.packUserOpP256Signature({
            messageHash: '0xd45f9c36f42a0a149e3b77dec8597563235ff5463bf2c9af2f3e75cbd6eb6935',
            publicKey: {
                x: '0x6af4a0dbda88d45e4c6d0c97784671e44df2896a06b1200bf5ab9c2f54c7aca3',
                y: '0xa439bdd51a1af33dbd97cc917ba103ce0694e46c4ad56d079991a0307364f956'
            },
            r: '0x8da3e1aa957bbefb34926bf9ee3892e4a27ee96cd54309deb23ba0151fb255c7',
            s: '0xb2587548067b70aee24b25424aa515bd5b452424e3ab0451834da7d43928ee3e',
            authenticatorData: '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
            clientDataSuffix: '","origin":"http://localhost:8000","crossOrigin":false}'
        }, '0x653120f7000065312f070000000000000000000000000000000000000000', undefined);
        expect(signature.isOk()).toBe(true);
    });
    test('packUserOpP256Signature-2', async () => {
        const soulwallet = new SoulWallet('https://localhost/', 'https://localhost/', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');
        const signature = await soulwallet.packUserOpP256Signature({
            messageHash: '0xb494f6738df235dea972d9f88139ff6c1bec48a97cbf12a44e5f39562b20c34c',
            publicKey: {
                x: '0x6af4a0dbda88d45e4c6d0c97784671e44df2896a06b1200bf5ab9c2f54c7aca3',
                y: '0xa439bdd51a1af33dbd97cc917ba103ce0694e46c4ad56d079991a0307364f956'
            },
            r: '0xd2d8837118f0063d3552b02734a749e52484d397ed1b4e35f0e01668b9942bb3',
            s: '0x9a31d197eb2a3f05e616639efd116daa4cdd68d7124062cc22f83852e6422d6e',
            authenticatorData: '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
            clientDataSuffix: '","origin":"http://localhost:8000","crossOrigin":false}'
        }, '0x653120f7000065312f070000000000000000000000000000000000000000', undefined);
        expect(signature.isOk()).toBe(true);
    });
    test('packUserOpP256Signature-3', async () => {
        const soulwallet = new SoulWallet('https://localhost/', 'https://localhost/', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');
        const signature = await soulwallet.packUserOpP256Signature({
            messageHash: '0x371406a3e3929737d36f8dfe36befd83f090d4975a520320a6c471dd61b9810b',
            publicKey: {
                x: '0x6af4a0dbda88d45e4c6d0c97784671e44df2896a06b1200bf5ab9c2f54c7aca3',
                y: '0xa439bdd51a1af33dbd97cc917ba103ce0694e46c4ad56d079991a0307364f956'
            },
            r: '0x0d9263333c04157e474092d1700414e2fe5fe118948dddd17fd1f7c8f0f648f3',
            s: '0x774875e034be9cb380630b9311d85ff4837d424a32dd6800772ab022cbaae627',
            authenticatorData: '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
            clientDataSuffix: '","origin":"http://localhost:8000","crossOrigin":false}'
        }, '0x653120f7000065312f070000000000000000000000000000000000000000', undefined);
        expect(signature.isOk()).toBe(true);
    });
    test('packUserOpRS256Signature', async () => {
        const soulwallet = new SoulWallet('https://localhost/', 'https://localhost/', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');

        const signature = await soulwallet.packUserOpRS256Signature({
            messageHash: "0x83714056da6e6910b51595330c2c2cdfbf718f2deff5bdd84b95df7a7f36f6dd",
            publicKey: {
                e: "0x010001",
                n: "0xc6807412ed8d616565508c879292686bb1db6f0561b62c7b66a2d3806d161c0ccef888d2c1efcf061e268a15e61e7d023646014c33b1ead31bef0e5379558e6ff71249b143c03abec33a2b055fc8e0a947393512e7e26ad33f0ad4aabfe32d0642965856d8e20204a44d78e36cc90db2a12cfbc37fa97360efd3a735c625ab814d6f6bb7c63abe261bbd9c52681c6221f936d617dc84de61556074f6c1d73b3ffd242d2940d3c02c5a269e390bd8e6b6301a5a0a339910f6480403d27d32c2ff2b9bf33bae45c36f423025ca41f05c97be5148b2cb276b31441274100bf3ca0b50da1ee04511be9bdbb4f12b7579ab3da780bc2c615e2a49f5e1f750b034d0af"
            },
            signature: "0x357a51b26e22dcfb87346bb6938cfb2b066d48d4c36cafd30ac105fe345199966f24c87fa66791d4c2341b97fa07421ef4115a9923e6249c53887b6f2313df60654083758fe7104286490e1a37481246395dcb097a86645dc3251afa5c87e4bc8f2960cfe3efa34c44bbee0fe3d602866c81a5fc432709443c623595556670a427502c63c1e6a86761c8b326b5f503bdcfdcf1f00871f330a9fddf6ae11adcff4a5f411edec30019c86936f8064b70f88cdb56ba6635175f7ef5c74f52de9db5498e4c4d4b75c8a3210e5b1a631af271c4b613a8752b2a1cea499bd81115d9ed34305d9ab4af753dc9b9630478fdb0787e5f5e0efb76504d15eff5fd02a38bf1",
            authenticatorData: "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000001",
            clientDataSuffix: "\",\"origin\":\"http://localhost:5500\",\"crossOrigin\":false}"
        }, '0x00', undefined);
        expect(signature.isOk()).toBe(true);
        const expectSignature = '0x0002' + '01'/* type=RS256 */ + '010000250000c6807412ed8d616565508c879292686bb1db6f0561b62c7b66a2d3806d161c0ccef888d2c1efcf061e268a15e61e7d023646014c33b1ead31bef0e5379558e6ff71249b143c03abec33a2b055fc8e0a947393512e7e26ad33f0ad4aabfe32d0642965856d8e20204a44d78e36cc90db2a12cfbc37fa97360efd3a735c625ab814d6f6bb7c63abe261bbd9c52681c6221f936d617dc84de61556074f6c1d73b3ffd242d2940d3c02c5a269e390bd8e6b6301a5a0a339910f6480403d27d32c2ff2b9bf33bae45c36f423025ca41f05c97be5148b2cb276b31441274100bf3ca0b50da1ee04511be9bdbb4f12b7579ab3da780bc2c615e2a49f5e1f750b034d0af357a51b26e22dcfb87346bb6938cfb2b066d48d4c36cafd30ac105fe345199966f24c87fa66791d4c2341b97fa07421ef4115a9923e6249c53887b6f2313df60654083758fe7104286490e1a37481246395dcb097a86645dc3251afa5c87e4bc8f2960cfe3efa34c44bbee0fe3d602866c81a5fc432709443c623595556670a427502c63c1e6a86761c8b326b5f503bdcfdcf1f00871f330a9fddf6ae11adcff4a5f411edec30019c86936f8064b70f88cdb56ba6635175f7ef5c74f52de9db5498e4c4d4b75c8a3210e5b1a631af271c4b613a8752b2a1cea499bd81115d9ed34305d9ab4af753dc9b9630478fdb0787e5f5e0efb76504d15eff5fd02a38bf149960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000001222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a35353030222c2263726f73734f726967696e223a66616c73657d';
        expect(signature.OK).toBe(expectSignature);
    });
    test('passkey-test', async () => {
        for (let index = 0; index < 10; index++) {
            const { privateKeyBase64, publicKeyBase64, X, Y } = await WebAuthNMock.createPassKey();
            for (let j = 0; j < 5; j++) {
                const userOpHash = '0x' + randomBytes(32).toString('hex');
                const { r, s, authenticatorData, clientDataSuffix, _message } = await WebAuthNMock.signPassKey(privateKeyBase64, publicKeyBase64, userOpHash);

                const p = WebAuthN.recoverWebAuthN(userOpHash, r, s, authenticatorData, clientDataSuffix);

                if (BigInt(p[0].x) === X && BigInt(p[0].y) === Y) {
                    // succ  
                } else if (BigInt(p[1].x) === X && BigInt(p[1].y) === Y) {
                    // succ  
                } else {
                    throw new Error('recover failed');
                }

                if (P256Lib.verify(BigInt(p[0].x), BigInt(p[0].y), BigInt(_message), BigInt(r), BigInt(s)) === false) {
                    throw new Error('verify failed');
                }
                if (P256Lib.verify(BigInt(p[1].x), BigInt(p[1].y), BigInt(_message), BigInt(r), BigInt(s)) === false) {
                    throw new Error('verify failed');
                }
            }
        }
        console.log('passkey-test 1000 times succ');
    });
});


class WebAuthNMock {

    /**
   * base64Url
   *
   * @static
   * @param {string} data
   * @return {*} 
   * @memberof Base64Url
   */
    private static base64Url(data: string) {
        return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
     * base64UrlToBytes32
     *
     * @static
     * @param {string} bytes32Str
     * @return {*} 
     * @memberof Base64Url
     */
    private static bytes32Tobase64Url(bytes32Str: string) {
        const userOpHashForBytes = bytes32Str.startsWith('0x') ? bytes32Str.slice(2) : bytes32Str;
        const byteArray = new Uint8Array(32);
        for (let i = 0; i < 64; i += 2) {
            byteArray[i / 2] = parseInt(userOpHashForBytes.substring(i, i + 2), 16);
        }
        return WebAuthNMock.base64Url(String.fromCharCode(...byteArray));
    }

    private static uint8ArrayToHex(uint8Array: Uint8Array): string {
        return '0x' + Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private static hexToUint8Array(hex: string): Uint8Array {
        if (hex.startsWith('0x')) hex = hex.slice(2);
        const len = hex.length;
        const uint8Array = new Uint8Array(len / 2);
        for (let i = 0; i < len; i += 2) {
            uint8Array[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return uint8Array;
    }

    private static arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return Buffer.from(binary, 'binary').toString('base64');
    }
    private static base64ToArrayBuffer(base64: string) {
        const binary_string = Buffer.from(base64, 'base64').toString('binary');
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    public static async createPassKey() {
        const algoParams = {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: 'SHA-256'
        };
        const keyPair = await webcrypto.subtle.generateKey(algoParams, true, ['sign', 'verify']);
        let X: bigint;
        let Y: bigint;
        // keyPair.publicKey to x,y
        const publicKeyBuffer = await webcrypto.subtle.exportKey('spki', keyPair.publicKey);
        if (publicKeyBuffer.byteLength === 91) {
            // ASN.1 DER format
            const _buffer: Uint8Array = new Uint8Array(publicKeyBuffer);
            if (_buffer[26] !== 0x04) {
                throw new Error('Unexpected public key format');
            }
            const x = publicKeyBuffer.slice(27, 59);
            const y = publicKeyBuffer.slice(59, 91);
            X = BigInt(WebAuthNMock.uint8ArrayToHex(new Uint8Array(x)));
            Y = BigInt(WebAuthNMock.uint8ArrayToHex(new Uint8Array(y)));
        } else {
            throw new Error('Unexpected public key format');
        }
        /*
        {
            const _pk_x = WebAuthNMock.hexToUint8Array(X.toString(16));
            const _pk_y = WebAuthNMock.hexToUint8Array(Y.toString(16));

            const _buffer1 = [48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61, 3, 1, 7, 3, 66, 0, 4];
            const _buffer: Uint8Array = new Uint8Array(91);
            for (let i = 0; i < 27; i++) {
                _buffer[i] = _buffer1[i];
            }
            for (let i = 0; i < _pk_x.length; i++) {
                _buffer[58 - i] = _pk_x[_pk_x.length - 1 - i];
            }
            for (let i = 0; i < _pk_y.length; i++) {
                _buffer[59 - i] = _pk_y[_pk_y.length - 1 - i];
            }

            const p1 = new Uint8Array(publicKeyBuffer).toString();
            const p2 = _buffer.toString();
            if (p1 !== p2) {
                throw new Error('Unexpected public key format');
            }

            // const publicKey: webcrypto.CryptoKey = await webcrypto.subtle.importKey(
            //     'spki',
            //     _buffer.buffer,
            //     algoParams,
            //     true,
            //     ['verify']
            // );

        }
        */


        const privateKeyBase64 = WebAuthNMock.arrayBufferToBase64(await webcrypto.subtle.exportKey('pkcs8', keyPair.privateKey));
        const publicKeyBase64 = WebAuthNMock.arrayBufferToBase64(await webcrypto.subtle.exportKey('spki', keyPair.publicKey));

        return {
            privateKeyBase64,
            publicKeyBase64,
            X,
            Y
        };
    }

    public static async signPassKey(privateKeyBase64: string, publicKeyBase64: string, userOpHash: string) {

        const algoParams = {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: 'SHA-256'
        };

        const publicKey: webcrypto.CryptoKey = await webcrypto.subtle.importKey(
            'spki',
            WebAuthNMock.base64ToArrayBuffer(publicKeyBase64),
            algoParams,
            true,
            ['verify']
        );
        const privateKey: webcrypto.CryptoKey = await webcrypto.subtle.importKey(
            'pkcs8',
            WebAuthNMock.base64ToArrayBuffer(privateKeyBase64),
            algoParams,
            true,
            ['sign']
        );
        const keyPair = {
            publicKey,
            privateKey
        };
        const challengeBase64 = WebAuthNMock.bytes32Tobase64Url(userOpHash);
        const clientDataSuffix = '","origin":"https://webauthn-mock.soulwallet.io","crossOrigin":false}';
        const clientDataJSON = `{"type":"webauthn.get","challenge":"${challengeBase64}${clientDataSuffix}`;
        const jsonBytes = ethers.toUtf8Bytes(clientDataJSON);
        const jsonBytesHex = '0x' + Array.from(jsonBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        let clientDataJSONHash: string = ethers.sha256(jsonBytesHex);
        let authenticatorData = '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000';
        if (clientDataJSONHash.startsWith('0x')) clientDataJSONHash = clientDataJSONHash.slice(2);
        const message = authenticatorData + clientDataJSONHash;
        const _message = ethers.sha256(message);

        const signature = await webcrypto.subtle.sign(
            algoParams,
            keyPair.privateKey,
            Buffer.from(message.slice(2), 'hex')
        );
        const isValid = await webcrypto.subtle.verify(algoParams, keyPair.publicKey, signature, Buffer.from(message.slice(2), 'hex'));
        if (isValid !== true) {
            throw new Error('sign failed');
        }

        const r = WebAuthNMock.uint8ArrayToHex(new Uint8Array(signature.slice(0, 32)));
        const s = WebAuthNMock.uint8ArrayToHex(new Uint8Array(signature.slice(32, 64)));
        return {
            r,
            s,
            authenticatorData,
            clientDataSuffix,
            _message
        }
    }
}