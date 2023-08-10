[@soulwallet/decoder](README.md) / Modules

# @soulwallet/decoder

## Table of contents

### Enumerations

- [AddressType](enums/AddressType.md)

### Classes

- [Err](classes/Err.md)
- [Ok](classes/Ok.md)

### Interfaces

- [DecodeResult](interfaces/DecodeResult.md)
- [Method](interfaces/Method.md)
- [TokenInfo](interfaces/TokenInfo.md)

### Type Aliases

- [Result](modules.md#result)

### Functions

- [DecodeUserOp](modules.md#decodeuserop)

## Type Aliases

### Result

Ƭ **Result**<`T`, `E`\>: [`Ok`](classes/Ok.md)<`T`, `E`\> \| [`Err`](classes/Err.md)<`T`, `E`\>

Defines a Result type, which can be either Ok or Err.

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Defined in

soulwallet-result/lib.cjs/Result.d.ts:4

## Functions

### DecodeUserOp

▸ **DecodeUserOp**(`chainId`, `entrypoint`, `userOperations`): `Promise`<[`Result`](modules.md#result)<[`DecodeResult`](interfaces/DecodeResult.md)[], `Error`\>\>

Decode the transaction data (userOp.calldata, interaction from soulwallet contract only).

**`Static`**

**`Memberof`**

Decoder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` |  |
| `entrypoint` | `string` | contract address |
| `userOperations` | `IUserOperation` | - |

#### Returns

`Promise`<[`Result`](modules.md#result)<[`DecodeResult`](interfaces/DecodeResult.md)[], `Error`\>\>

{Promise<Result<DecodeResult[], Error>>}

#### Defined in

[soulwallet-decoder/src/decoder.ts:171](https://github.com/SoulWallet/soulwalletlib/blob/2de4184/packages/soulwallet-decoder/src/decoder.ts#L171)
