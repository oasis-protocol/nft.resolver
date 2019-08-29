import URI from "urijs";


/** Nft type */
export enum NftType {
  CONSUMABLE = "CONSUMABLE",
  ARMOR = "ARMOR",
  MATERIAL = "MATERIAL",
  TASK = "TASK",
  OTHER = "OTHER",
}

/**
 * THE OASIS URI Format 
 * oasis://{ContractAddress}/{GameName}/{ItemType}/{ItemName}?customField=customVal&...
 */
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

  static fromMeta(contract: string, game: string, type: NftType, name: string, subTypes?: Map<string, string>): NftURI {
    const NftUri = new NftURI();
    NftUri.contract = contract;
    NftUri.game = game;
    NftUri.type = type;
    NftUri.name = name;
    NftUri.subTypes = new Map<string, string>();
    if (subTypes) {
      subTypes.forEach((v, k) => {
        NftUri.subTypes.set(k, v);
      })
    }
    return NftUri;
  }

  constructor(uri: string = "") {
    super(uri);
    if (!uri) return this;

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
    this.type = NftType[typ];
    if (!this.type) throw new Error("invalid nft type. Only support `CONSUMABLE`,`ARMOR`,`MATERIAL`,`TASK` and `OTHER`");
    if (this.game == "" || this.name == "") {
      throw new Error("meta data resolved from uri is not valid");
    }

    this.subTypes = new Map<string, string>();
    const subTypes = this.parseSubTypes(query["subtypes"] as string);
    if (subTypes.length > 0) {
      for (let i = 0; i < subTypes.length; i++) {
        const key = subTypes[i];
        this.subTypes.set(key, query[key]);
      }
    }
  }

  get raw(): string {
    let baseUri = `oasis://${this.contract}/${this.game}/${this.type}/${this.name}`;
    if (this.subTypes && this.subTypes.size > 0) {
      const query = [];
      const keys = [];
      this.subTypes.forEach((v, k) => {
        keys.push(k);
        query.push(`${k}=${v}`);
      })
      baseUri += `?subtypes=[${keys.join(',')}]&${query.join('&')}`
    }
    return baseUri;
  }

  private parseSubTypes(params: string): string[] {
    if (!params) {
      return []
    }
    return params.replace(/\[|\]/g, '').split(',');
  }

  getSubType(k: string): string {
    return this.subTypes.get(k);
  }

  addSubType(k: string, v: string) {
    this.subTypes.set(k, v);
  }

  rmSubType(k: string, v: string) {
    this.subTypes.delete(k);
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
  /** Item name */
  name: string;
  /** Item description */
  description: string;
  /** Item image icon url */
  image: string;
  /** Item rich properties */
  properties: JSON;

  constructor(name: string, description: string, image: string, properties: JSON) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.properties = properties;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  setProps(newProps: JSON) {
    this.properties = newProps;
  }

  addProps(newProps: JSON) {
    this.properties = Object.assign({}, this.properties, newProps);
  }

  rmProps(props: JSON) {
    for (let key in props) {
      if (props[key]) {
        delete props[key]
      }
    }
  }
}