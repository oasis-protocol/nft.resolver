import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { NFT } from '../nft';

interface Auth {
  actor: string,
  permission: string,
  privateKey: string,
}

export class AssetEosAPI {
  /** Api handler */
  api: Api;
  /** Chain Name */
  name: string = "eosio";
  /** Asset Creator Auth  */
  creator: Auth;
  /** Asset Issuer Auth */
  issuer: Auth;

  constructor(endpoint: string, creator: Auth, issuer: Auth) {
    this.creator = creator;
    this.issuer = issuer;

    const signatureProvider = new JsSignatureProvider([creator.privateKey, issuer.privateKey]);
    const rpc = new JsonRpc(endpoint);
    this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  }

  /**
   * Create asset on blockchain
   * 
   * @param contract Target contract account
   * @param issuer Asset issuer
   * @param maximum Maximum number of tokens. Support maximum 4 digits decimal. 
   * @param symbol Token symbol
   * @param typ Token type. `0` means coin, `1` means nft
   * @param method Contract method. Default `create`.
   */
  async createAsset(contract: string, issuer: string, maximum: number, symbol: string, typ: number, method: string = "create"): Promise<any> {
    return await this.api.transact({
      actions: [{
        account: contract,
        name: method,
        authorization: [this.creator],
        data: {
          issuer,
          asset: `${maximum} ${symbol}`,
          typ
        }
      }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
  }

  /**
   * 
   * @param contract Target contract account
   * @param symbol Token symbol
   * @param pubkeys Public keys of issuers to sign nfts
   * @param method Contract method. Default `addpubkeys`
   */
  async addPubkeys(contract: string, symbol: string, pubkeys: string[], method: string = "addpubkeys"): Promise<any> {
    return await this.api.transact({
      actions: [{
        account: contract,
        name: method,
        authorization: [this.issuer],
        data: {
          symbl: symbol,
          pubkeys: pubkeys
        },
      }]
    })
  }

  async issueCoin(contract: string, to: string, amount: number, symbol: string, memo: string = "", method: string = "issuecoin"): Promise<any> {
    return await this.api.transact({
      actions: [{
        account: contract,
        name: method,
        authorization: [this.issuer],
        data: {
          to,
          asset: `${amount} ${symbol}`,
          memo
        }
      }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
  }

  async issueNfts(contract: string, nfts: NFT[], to: string, memo: string = "", method: string = "issuenft"): Promise<any> {
    if (nfts.length == 0) {
      throw new Error("nft list should not be empty");
    }
    // check symbol is the same or not
    const symbol = nfts[0].symbol
    for (let i = 1; i < nfts.length; i++) {
      if (nfts[i].symbol != symbol) {
        throw new Error("symbols of this batch of NFT are not the same");
      }
    }
    const uris = nfts.map(item => item.uri)
    this.api.transact({
      actions: [{
        account: contract,
        name: method,
        authorization: [this.issuer],
        data: {
          to,
          symbl: symbol,
          uris: uris,
          memo
        }
      }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
  }

  /**
   * Store corresponding signatures of NFT on blockchain
   * 
   * @param contract Contract account name  
   * @param symbl Token symbol
   * @param nfts Nft instance batch
   * @param signatures Signature of each nft
   * @param method Contract method. Default `signnfts`
   */
  async signNfts(contract: string, symbl: string, uuids: string[], signatures: string[], method: string = "signnft"): Promise<any> {
    return await this.api.transact({
      actions: [{
        account: contract,
        name: method,
        authorization: [this.issuer],
        data: {
          symbl,
          uuids,
          signs: signatures
        }
      }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
  }
}