import { NftURI, NftExtMeta } from "./uri-resolver";
import { EosSigner as Signer } from "./signer";

export class NFT {
  uuid: string;
  meta: NftURI;
  extMeta: NftExtMeta;
  symbol: string;
  signature: string;

  constructor(uri: string, symbol: string, uuid: string = "") {
    if (uri == "") {
      throw new Error("uri should not be empty");
    }
    if (symbol == "") {
      throw new Error("symbol should not be empty");
    }

    this.uuid = uuid;
    this.meta = new NftURI(uri);
    this.symbol = symbol;
  }

  get uri(): string {
    return this.meta.raw;
  }

  get contract(): string {
    return this.meta.contract;
  }

  get game(): string {
    return this.meta.game;
  }

  get type(): string {
    return this.meta.type
  }

  get category(): string {
    return this.meta.category;
  }

  get params(): JSON {
    return this.meta.allParams();
  }

  get extendedMetaData(): string {
    return this.extMeta.toString();
  }

  setExtMetaData(ext: NftExtMeta) {
    this.extMeta = ext;
  }

  sign(sk: string): string {
    this.signature = Signer.sign(this.uuid, this.uri, this.symbol, sk);
    return this.signature
  }

  verifySign(pk: string): boolean {
    if (!this.signature) {
      throw new Error('nft signature is undefined');
    }
    return Signer.veriySign(this.uuid, this.uri, this.symbol, this.signature, pk);
  }
}