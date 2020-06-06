# nft.resolver

Resolver for non-fungible tokens issued by oasis.asset.

NFT Resolver 是供游戏开发者使用的 SDK，提供两个功能：

- NFT 的标准化创建与签名

- 根据 NFT 的元数据，定制化生成扩展元数据

API 请查阅[文档](https://mobiusgame.github.io/nft-resolver/)

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

### NFT 元数据

请移步至[文档](https://docs.theoasis.io/core-concept/metadata)。

### NFT resolve

```javascript
import { NFT } from "nft-resolver";

// Initialize with uuid.
const uuid = "123456";
const symbol = "SWORD";
const uri = "oasis://rogeman/OTHER/antsword/other1/other2?subtypes=type1,type2&types1=1&types2=2";
const nft = new NFT(uri, symbol, uuid);

// or initialize without uuid
const nft = new NFT(uri, symbol);

// Get nft uri and meta data decoded from uri
nft.uri    // "oasis://rogeman/ARMOR/antsword/other1/other2?subtypes=type1,type2&types1=1&types2=2"
nft.world        // "rogeman"
nft.type        // "OTHER"
nft.category    // "antsword"
nft.params    // { subtypes:"type1,type2", type1: "1", types2: "2"}
nft.fragments  // ["other1","other2"]

// Set extended meta data
nft.setExtMetaData({
    "name": "Asset Name",
    "description": "Lorem ipsum...",
    "image": "...",
    "properties": {
        "simple_property": "example value",
        // 该字段为建议项
        // 下面为一个例子
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
  type2: "2",
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
//         // 可自定义字段，以下仅为一个例子
//         "simple_property": "Simple property",
//         "rich_property": {...}
//     }
// }
```
