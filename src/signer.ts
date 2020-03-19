import ecc from 'eosjs-ecc';
import sha256 from 'crypto-js/sha256';
import Web3 from 'web3';

export namespace EosSigner {
  export function sign(uuid: string, uri: string, symbol: string, sk: string): string {
    const digest = uuid + uri + symbol
    return ecc.signHash(sha256(digest).toString(), sk)
  }

  export function veriySign(uuid: string, uri: string, symbol: string, sign: string, pk: string): boolean {
    return ecc.verify(sign, uuid + uri + symbol, pk);
  }

}

export namespace Web3Signer {
  export function sign(uuid: string, uri: string, symbol: string, sk: string) {
    let digest = uuid + uri + symbol;
    const hash = Web3.utils.soliditySha3(digest);
    return (new Web3()).eth.accounts.sign(hash, sk).signature;
  }

  export function verifySign(uuid: string, uri: string, symbol: string, signature: string, signer: string): boolean {
    let digest = uuid + uri + symbol;
    const hash = Web3.utils.soliditySha3(digest);
    return (new Web3()).eth.accounts.recover(hash, signature) == signer;
  }
}