import URI from "urijs";

export class NftURI extends URI {
  /** Asset contract */
  contract: string

  /** Game name */
  game: string

  /** NFT type */
  type: NftType

  /** NFT name */
  name: string

  /** Sub types */
  subTypes: Map<string, string>

  constructor(uri: string) {
    super(uri);
    const path = this.path().split('/');
    const query = this.query().split('&');

    if (path.length < 4) {
      throw new Error("invalid NFT uri");
    }

    let typ: string
    [this.contract, this.game, typ, this.name] = path;
    this.type = typ as NftType;

    this.subTypes = new Map<string, string>();
    query.forEach(item => {
      const kv = item.split('=')
      this.subTypes.set(kv[0], kv[1])
    })
  }

  get raw(): string {
    return this.toString()
  }

  allSubTypes(): JSON {
    const types: any = {}
    this.subTypes.forEach((v, k) => {
      types[k] = v
    })
    return types as JSON
  }
}

/** NFT extended meta data creator*/
export class NftExtMeta implements ExtendedMeta {
  name: string;
  description: string;
  image: string;
  properties: Properties

  constructor(name: string, description: string, image: string, properties: Properties) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.properties = properties;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}