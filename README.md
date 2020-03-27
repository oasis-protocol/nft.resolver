# nft.resolver

[中文版](README_CN.md)

Resolver for non-fungible tokens issued by oasis.asset.

NFT Resolver is a SDK for NFT developer：

- NFT generate and sign following `oasis.asset` standard.

- Customized and generate extended meta data from a NFT.

Check out the [API](https://mobiusgame.github.io/nft-resolver/)

## Installation

Install with npm:

```shell
npm install nft-resolver -S
```

or with yarn:

```shel
yarn add nft-resolver -S
```

## Usage

### NFT resolve

```javascript
import { NFT } from "nft-resolver";

// Initialize with uuid.
const uuid = "123456";
const symbol = "SWORD";
const uri = "oasis://Game/OTHER/antsword?subtypes=type1,type2&types1=1&types2=2";
const nft = new NFT(uri, symbol, uuid);

// or initialize without uuid
const nft = new NFT(uri, symbol);

// Get nft uri and meta data decoded from uri
nft.uri    // "oasis://game/ARMOR/antsword/other1/other2?subtypes=type1,type2&types1=1&types2=2"
nft.game        // "game"
nft.type        // "OTHER"
nft.category    // "antsword"
nft.params      // { subtypes:"type1,type2", type1: "1", types2: "2"}
nft.fragments   // ["other1","other2"]

// Set extended meta data
nft.setExtMetaData({
    "name": "Asset Name",
    "description": "Lorem ipsum...",
    "image": "...",
    "properties": {
      // An example
      "simple_property": "example value",
      "rich_property": {...}
    }
})
nft.extendedMetaData;   // the same with above

// Sign nft
const signature = nft.sign('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3');

// Verify signature
nft.verifySign('EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV');
```

### URI resolve

URI resolver provided a low-level uri assemble or disassemble.

```javascript
import { NftURI } from "nft-resolver";

const uriString =
  "oasis://rogeman/ARMOR/antsword?subtypes=type1,type2&type1=1&type2=2";
const game = "rogeman";
const type = "ARMOR";
const category = "antsword";
const nftUri = new NftURI(game, type, category, {
  subtypes: "type1,type2",
  type1: "1",
  type2: "2"
});

nftUri.raw == uriString; // true

// Sub types manages
nftUri.getParam("type1"); // "1"
nftUri.addParam("type3", "3");
nftUri.rmParam("type3");

// Return all query params
nftUri.allParams(); // Object{"subtypes":"type1,type2","type1":"1","type2":"2"}
```

Extended Meta data class is provided:

```javascript
import {NftExtMeta} from 'nft-resolver';

const name = "Asset Name";
const desp = "Simple description";
const image = "https://www.google.com/image/1.jpg";
const properties: Properties = {
  simpleProperty: "Simple property",
  richProperty:{...}    // json object
};

const extMeta = new NftExtMeta(name,desp,image,properties);

// Set new property
extMeta.setProps(newProps);

extMeta.toString();
// {
//     "name": "Asset Name",
//     "description": "Simple description",
//     "image": "https://www.google.com/image/1.jpg",
//     "properties": {
//         "simple_property": "Simple property",
//         "rich_property": {...}
//     }
// }
```

## NFT Meta Data

### Global ID（uuid）

Every NFT has a global unqiue id with type `uint128` generated at issuing. The format is `| Contract Address | Token ID | Chain id(if possible) |`

**Solidity**

type: uint256

| 160 bits         | 64 bits  | 32 bits |
| ---------------- | -------- | ------- |
| Contract address | Token ID | Reserve |

**EOS**

type: uint128

| 64 bits          | 64 bits  |
| ---------------- | -------- |
| Contract account | Token ID |

### Symbol

General name for representing a class of asset uniquely.

### URI

URI format is the entrance of retrieving extended meta data following RFC3986. We prefer the URI protocol below:

```
{brand}://{Game Name}/{Type}/{Category}?customField=customValue&...
```

`brand` is a certain general protocol name. We usually use `oasis`.

**Game**

Game name that issue this asset.

**Type**

Asset type. For easier to understand the asset type, we recommend to use the **type words** below.

- CONSUMABLE - Consumable items, like medicine, reels.
- ARMOR - Armor item, like hat, clothes, shose.
- MATERIAL - Material items, usually for strengthen, synthetic armor, or other usages.
- TASK - Task special items with limited usages.
- SOUVENIR - Souvenir items, usually representing some experiences. Usually has no special usages.

Developers can also customize the type string.

**Category**

Category name of asset, representing a general detail name of a kind of asset.

The difference between `symbol` and `category` is that: `symbol` is the symbol of token, representing a big class of asset, like **SWORD**, **HAT**; `category` is the detail name of this category of asset, like **yellow-sword**, **green-hat** and so on.

**Query Params**

Asset issuers can add any types of fields at **query string** to describe the asset more clearlly and widely.

**Example**

case 1：Game「RogeMan」issued a medicine to recover life with the name「guanglingsan」. The URI can be:

```
oasis://RogeMan/CONSUMABLE/guanglingsan
```

case 2：Game「Switch」issued a skin for actor's head at contract「snake.asset」with the name「icecap」. The URI can be:

```
oasis://Switch/ARMOR/icecap?pos=HEAD
```

## NFT Extended Meta Data

Extended meta data is a upper-layer result of decoding NFT URI. Different game can implement their own logic to understand the same NFT, and return different extended meta data.

A typical JSON data for extended meta data is below:

```json

{

    "name": "Asset Name",               // required
    "description": "Lorem ipsum...",    // required
    "image": "https:\/\/s3.amazonaws.com\/your-bucket\/images\/{id}.png",    // required
    "properties": {
      ... // Key => Value property fields
    }
}

```

**Field Name Definition**

- `name` **string** - NFT name
- `description` **string** - NFT descriptoin
- `image` **string** - NFT image url
- `properties` **JSON** NFT further properties
