import URI from "urijs";


/** Nft type */
export enum NftType {
  CONSUMABLE = "CONSUMABLE",
  ARMOR = "ARMOR",
  MATERIAL = "MATERIAL",
  TASK = "TASK",
  OTHER = "OTHER",
  SOUVENIR = "SOUVENIR"
}

/** Nft extended meta data */
export interface ExtendedMeta {
  name: string,
  description: string,
  image: string,
  properties: JSON
}

/**
 * THE OASIS URI Format 
 * oasis://{WorldName}/{ItemType}/{ItemCategory}?customField=customVal&...
 */
export class NftURI extends URI {
  /** World name */
  world: string

  /** NFT type */
  type: NftType

  /** NFT category */
  category: string

  /** Uri remaining fragments */
  fragments: string[]

  /** query params */
  params: Map<string, string>

  static fromMeta(world: string, type: NftType, category: string, params?: Map<string, string>): NftURI {
    const NftUri = new NftURI();
    NftUri.world = world;
    NftUri.type = type;
    NftUri.category = category;
    NftUri.params = new Map<string, string>();
    if (params) {
      params.forEach((v, k) => {
        NftUri.params.set(k, v);
      })
    }
    return NftUri;
  }

  constructor(uri: string = "") {
    super(uri);
    if (!uri) return this;

    this.world = this.hostname();
    if (this.world == "") {
      throw new Error("uri hostname should not be empty");
    }
    const query = this.query(true);

    let typ: string
    const segments = this.segment().slice();
    [typ, this.category] = [segments[0], segments[1]];
    this.type = NftType[typ] || typ;
    if (this.world == "" || this.category == "") {
      throw new Error("meta data resolved from uri is not valid");
    }

    this.fragments = segments.slice(2);

    this.params = new Map<string, string>();
    for (let key in query) {
      this.params.set(key, query[key]);
    }
  }

  get raw(): string {
    let baseUri = `${this.protocol()}://${this.world}/${this.type}/${this.category}`;
    if (this.params && this.params.size > 0) {
      const query = [];
      const keys = [];
      this.params.forEach((v, k) => {
        keys.push(k);
        query.push(`${k}=${v}`);
      })
      baseUri += `?params=${keys.join(',')}&${query.join('&')}`
    }
    return baseUri;
  }

  getParam(k: string): string {
    return this.params.get(k);
  }

  addParam(k: string, v: string) {
    this.params.set(k, v);
  }

  rmParam(k: string, v: string) {
    this.params.delete(k);
  }

  allParams(): JSON {
    const types: any = {}
    this.params.forEach((v, k) => {
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

  constructor(name: string, description: string, image: string, properties?: JSON) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.properties = properties || {} as JSON;
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
        delete props[key];
      }
    }
  }
}