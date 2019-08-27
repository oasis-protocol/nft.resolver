import Web3 from 'web3';
import Contract, { CustomOptions } from 'web3/eth/contract';
import PromiEvent from 'web3/promiEvent';
import { Account } from 'web3/eth/accounts';

type PrivateKey = string

export interface trxOpts {
  method: string;
  gas?: number;
  gasPrice?: string
}

export class AssetWeb3API {
  web3: Web3;
  // Contract creator account
  creator: Account;
  // Contract issuer account
  issuer: Account;

  constructor(url: string, creator: PrivateKey, issuer: PrivateKey) {
    const web3 = new Web3(url);

    this.creator = web3.eth.accounts.privateKeyToAccount(creator);
    web3.eth.accounts.wallet.add(this.creator);
    this.issuer = web3.eth.accounts.privateKeyToAccount(issuer);
    web3.eth.accounts.wallet.add(this.issuer);

    this.web3 = web3;
  }

  initContract(contract: string, abi: any[], opts?: trxOpts): Contract {
    return new Contract(abi, contract, {
      gas: opts && opts.gas,
      gasPrice: opts && opts.gasPrice
    });
  }

  /**
   * Create asset in OASIS.ASSET contract.
   * 
   * @param contract Contract address
   * @param abi Contract abi json object
   * @param issuer Token issuer address
   * @param maximum Maximum token value
   * @param symbol Token symbol
   * @param typ Token type. `0` means coin; `1` means nft.
   * @param opts Transaction options
   */
  createAsset(contract: string, abi: any[], issuer: string, maximum: number, symbol: string, typ: number, opts?: trxOpts): PromiEvent<any> {
    return this.initContract(contract, abi, opts).methods[opts && opts.method || "create"](issuer, maximum, symbol, typ).send({ from: this.creator.address });
  }

  /**
   * Issue coin to target address.
   * 
   * @param contract Contract address
   * @param abi Contract abi json object
   * @param to Issue target address
   * @param value Token value issued
   * @param symbol Token symbol
   * @param extra Transaction extra data
   * @param opts Transaction options
   */
  issueCoin(contract: string, abi: any[], to: string, value: number, symbol: string, extra: Buffer, opts?: trxOpts): PromiEvent<any> {
    return this.initContract(contract, abi, opts).methods[opts && opts.method || "issuerCoin"](to, value, symbol, extra).send({ from: this.issuer.address });
  }

  /**
   * Issue nft to target address with the given uris.
   * 
   * @param contract Contract address
   * @param abi Contract abi json object
   * @param to Issue target address
   * @param symbol Token symbol
   * @param uris NFT uri list
   * @param extra Transaction extra data
   * @param opts Transaction options
   */
  issueNfts(contract: string, abi: any[], to: string, symbol: string, uris: string[], extra: Buffer, opts?: trxOpts) {
    const bytesUris = new Array<Buffer>();
    for (let uri of uris) {
      const bytes = new Buffer(256);
      for (let i = 0; i < uri.length; i++) {
        bytes[i] = uri.charCodeAt(i);
      }
    }
    return this.initContract(contract, abi, opts).methods[opts && opts.method || "issuerNFTs"](to, symbol, bytesUris, extra).send({ from: this.issuer.address });
  }

  /**
   * Add signers for nft.
   * 
   * @param contract Contract address
   * @param abi Contract abi json object
   * @param symbol Token symbol
   * @param signers Signers for nft
   * @param opts Transaction options
   */
  addSigners(contract: string, abi: any[], symbol: string, signers: string[], opts?: trxOpts): PromiEvent<any> {
    return this.initContract(contract, abi, opts).methods[opts && opts.method || "addSigners"](symbol, signers).send({ from: this.issuer.address });
  }

  /**
   * Add signatures of nfts. Signatures should be generated off-chain.
   * 
   * @param contract Contract address
   * @param abi Contract abi json object
   * @param uuids Token global id list
   * @param signs NFT signature list
   * @param opts Transaction options
   */
  signNFTs(contract: string, abi: any[], uuids: string[], signs: string[], opts?: trxOpts): PromiEvent<any> {
    const v = [], r = [], s = [];
    signs.forEach(signature => {
      r.push(signature.slice(0, 64));
      s.push("0x" + signature.slice(64, 128));
      v.push("0x" + signature.slice(128, 130));
    })
    return this.initContract(contract, abi, opts).methods[opts && opts.method || "signNFTs"](uuids, v, r, s).send({ from: this.issuer.address });
  }
}