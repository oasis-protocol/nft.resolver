import ecc from 'eosjs-ecc';
import sha256 from 'crypto-js/sha256';
import { NFT } from './nft';
import { Buffer } from "buffer";

export namespace Signer {
  export function sign(uuid: string, uri: string, symbol: string, sk: string): string {
    const digest = uuid + uri + symbol
    return ecc.signHash(Buffer.from(sha256(digest).toString()), sk)
  }

  export function signObj(nft: NFT, sk: string): string {
    return sign(nft.uuid, nft.meta.raw, nft.symbol, sk)
  }
}
