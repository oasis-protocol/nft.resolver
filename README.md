# nft.resolver

Resolver for non-fungible tokens issued by oasis.asset.

NFT Resolver 是供游戏开发者使用的 SDK，提供两个功能：

- NFT 的标准化创建与签名

- 根据 NFT 的元数据，定制化生成扩展元数据

API 请查阅[Document]()

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
const uri = "oasis://contract/game/OTHER/antsword?subtypes=type1,type2&types1=1&types2=2";
const nft = new NFT(uri, symbol, uuid);

// or initialize without uuid
const nft = new NFT(uri, symbol);

// Get nft uri and meta data decoded from uri
nft.uri    // "oasis://contract/game/ARMOR/antsword?subtypes=type1,type2&types1=1&types2=2"
nft.contract    // "contract"
nft.game        // "game"
nft.type        // "OTHER"
nft.category    // "antsword"
nft.subTypes    // { type1: "1", types2: "2"}

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
  "oasis://oasis.asset/rogeman/ARMOR/antsword?subtypes=type1,type2&type1=1&type2=2";
const contract = "oasis.asset";
const game = "rogeman";
const type = "ARMOR";
const category = "antsword";
const nftUri = new NftURI(contract, game, type, category, {
  type1: "1",
  type2: "2"
});

nftUri.raw == uriString; // true

// Sub types manages
nftUri.getSubType("type1"); // "1"
nftUri.addSubType("type3", "3");
nftUri.rmSubType("type3");

// Return all sub types
nftUri.allSubTypes(); // Object{"type1":"1","type2":"2"}
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

## NFT 元数据(meta data)

### Global ID（uuid）

每个 NFT 都有一个全局唯一的 id，在发行时自动生成，格式为`| 发行合约地址 | 合约内的资产id | chain id |`。

**Solidity**

type: uint256

| 160 bits | 64 bits     | 32 bits                    |
| -------- | ----------- | -------------------------- |
| 合约地址 | 内部递增 ID | Chain id（预留给跨链场景） |

**EOS**

type: uint128

| 64 bits    | 64 bits     |
| ---------- | ----------- |
| 合约账户名 | 内部递增 ID |

### Symbol

资产符号用于唯一性表征该资产的总称。

### URI

URI 遵循 RFC3986 协议，是 NFT 扩展元数据的解析入口。在 THE OASIS 中，我们约定各游戏所发行的 NFT 资产，其 URI 遵循以下格式：

```

oasis://[资产合约地址]/[游戏名]/[类型]/[道具类名]?customField=customValue&......

```

**资产合约地址**

发行该资产的合约地址。在进行跨游戏资产转移过程中，将会**验证该字段是否与实际合约地址一致**。

**游戏名**

由发行方指定的游戏名。

**类型**

资产类型。为了方便统一解析字段，THE OASIS 预定义了以下字符串表征常用的游戏道具类型：

- CONSUMABLE - 消耗类道具
- ARMOR - 装备类道具
- MATERIAL - 材料类道具
- TASK - 任务类道具。该类道具具有唯一用途，且获得途径通常也是比较特殊，如通过任务、任务期间击杀指定怪物等。
- OTHER - 其他类道具，即无法归类为上述四类的道具。

项目方也可以自定义其他的类型字段作为道具类型。但我们不建议这么做，原因是这需要项目方针对性的为该类资产设计解析逻辑，不利于道具的场景扩展。

发行方可对道具类型进一步细化，以 query params 的形式定义子类型，统一格式为：`subtypes=subtype1,subtype2&subtype1=xxx&subtype2=xxx`。

**道具类名**

道具类名通常表示了一类道具的总称（如蓝宝石，火焰之剑等），便于游戏项目方提供基本的扩展元数据。该字段与 Symbol 的区别是，Symbol 有一定长度限制，应使用 Token 名称的简写，或是非可读代号，而 URI 中的名称可以使用道具的全名。

**Example**

case 1：游戏【RogeMan】在资产合约【roge.asset】中发行了一瓶恢复 hp 的药品，名为【guanglingsan】，则其 URI 可以是：

```

oasis://roge.asset/RogeMan/CONSUMABLE/guanglingsan

```

case 2：游戏【Switch】在资产合约【snake.asset】中发行了一个皮肤，名为【icecap】的头库装饰品，则其 URI 可以是：

```

oasis://snake.asset/Switch/ARMOR/icecap?pos=HEAD

```

## NFT 扩展元数据(extended meta data)

扩展元数据是游戏根据 URI 进行定制化解析所返回的 JSON 数据，反应来该 NFT 在当前游戏中的名称、属性、用途等定制化内容。

在 THE OASIS 中，我们希望统一扩展元数据的格式，以方便不同游戏项目方对 NFT 进行定制化解析：

```json

{

    "name": "Asset Name",               // 必须项
    "description": "Lorem ipsum...",    // 必须项
    "image": "https:\/\/s3.amazonaws.com\/your-bucket\/images\/{id}.png",    // 必须项
    "properties": {
      ... // 定义JSON对象
    }
}

```

**字段名定义**

- `name` **string** - NFT 的名称
- `description` **string** - NFT 的详细介绍
- `image` **string** - NFT 图片的 url
- `properties` **JSON** NFT 属性对象

## 道具玩法

### 合成

合成是不同道具的组合，其原理是将不同道具销毁，生成新的道具。

### 镶嵌

镶嵌也是不同道具的组合。与合成不同的是，镶嵌是可逆的过程，即镶嵌材料道具并不销毁，可再次拆分。游戏项目方应将镶嵌的关系记录存储在中心化数据库中，且保留镶嵌材料的道具 ID。

当某道具作为镶嵌材料时，其不应进行跨合约转移。该限制逻辑可放在`world.canICTransfer`中调用。

### 强化

强化是对道具属性值的修改。由于链上 NFT 元数据不可修改，对于具体属性值的修改只能记录在游戏的中心化数据库中。
