import ecc from 'eosjs-ecc';
import sha256 from 'crypto-js/sha256';
import { NFT } from './nft';

export namespace Signer {
  export function sign(uuid: string, uri: string, symbol: string, sk: string): string {
    const digest = uuid + uri + symbol
    return ecc.signHash(sha256(digest).toString(), sk)
  }

  export function signObj(nft: NFT, sk: string): string {
    return sign(nft.uuid, nft.meta.raw, nft.symbol, sk)
  }

  export function veriySign(uuid: string, uri: string, symbol: string, sign: string, pk: string): boolean {
    return ecc.verify(sign, uuid + uri + symbol, pk);
  }

  export function verifyNftSign(nft: NFT, pk: string): boolean {
    return veriySign(nft.uuid, nft.meta.raw, nft.symbol, nft.signature, pk);
  }
}
