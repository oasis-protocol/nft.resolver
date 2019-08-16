import { NftURI, NftExtMeta } from "./uri-resolver";
import { Signer } from "./signer";

export class NFT {
  uuid: string;
  meta: NftURI;
  extMeta: NftExtMeta;
  symbol: string;

  constructor(uuid: string, uri: string, symbol: string) {
    if (uuid == "") {
      throw new Error("uuid should not be empty");
    }
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

  sign(sk: string): string {
    return Signer.sign(this.uuid, this.uri, this.symbol, sk);
  }
}