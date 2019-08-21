import { NftURI, NftExtMeta } from "./uri-resolver";
import { Signer } from "./signer";

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
    this.extMeta = {} as any;
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

  get name(): string {
    return this.meta.name;
  }

  get subTypes(): JSON {
    return this.meta.allSubTypes();
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
    return Signer.verifyNftSign(this, pk);
  }
}