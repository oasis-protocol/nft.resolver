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
    if (this.protocol() != "oasis") {
      throw new Error("uri protocol should be `oasis`");
    }

    this.contract = this.hostname();
    if (this.contract == "") {
      throw new Error("uri hostname should not be empty");
    }
    const query = this.query(true);

    let typ: string
    [this.game, typ, this.name] = this.segment();
    this.type = typ as NftType;
    if (this.game == "" || this.name == "") {
      throw new Error("meta data resolved from uri is not valid");
    }

    const subTypes = this.parseSubTypes(query["subtypes"] as string);
    if (subTypes.length > 0) {
      this.subTypes = new Map<string, string>();
      for (let i = 0; i < subTypes.length; i++) {
        const key = subTypes[i];
        this.subTypes.set(key, query[key]);
      }
    }
  }

  get raw(): string {
    return this.toString()
  }

  parseSubTypes(params: string): string[] {
    if (!params) {
      return []
    }
    return params.replace(/\[|\]/g, '').split(',');
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
  properties: Properties;

  constructor(name: string, description: string, image: string, properties: Properties) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.properties = properties;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  setProps(newProps: Properties) {
    this.properties = newProps;
  }
}