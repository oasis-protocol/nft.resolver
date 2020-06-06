import ecc from 'eosjs-ecc'
import Chai from 'chai'
import { NFT } from '../src';

const expect = Chai.expect

describe('nft resolver', () => {
  it('general nft resolve', () => {
    const uri = "oasis://game/ARMOR/antsword";
    const uuid = "1000"
    const nft = new NFT(uri, "SWORD", uuid);
    expect(nft.world).to.equal("game");
    expect(nft.uuid).to.equal(uuid);
    expect(nft.type).to.equal("ARMOR");
    expect(nft.category).to.equal("antsword");
    expect(nft.uri).to.equal(uri);
  })

  it('nft resolved with type `OTHER` and sub types', () => {
    const uri = "oasis://game/OTHER/antsword?subtypes=type1,type2&type1=1&type2=2";
    const nft = new NFT(uri, "SWORD");
    expect(nft.params["type1"]).to.equal('1');
    expect(nft.params["type2"]).to.equal('2');
  })

  it('nft with invalid uri', () => {
    try {
      const nft = new NFT("invalid://game/ARMOR/antsword", "SWORD")
    } catch (e) {
      expect(e).not.to.undefined;
    }

    try {
      const nft = new NFT("oasis://game", "SWORD");
    } catch (e) {
      // console.log(e.message)
      expect(e).not.to.undefined;
    }

    try {
      const nft = new NFT("oasis://game/type", "SWORD");
    } catch (e) {
      // console.log(e.message)
      expect(e).not.to.undefined;
    }
  })
})

describe('nft signer', () => {
  it('nft signing', async () => {
    const uri = "oasis://game/ARMOR/antsword";
    const uuid = "1000";
    const symbol = "SWORD"
    const nft = new NFT(uri, symbol, uuid);
    const priv = await ecc.randomKey();
    const pub = ecc.privateToPublic(priv);
    const sign = nft.sign(priv);
    expect(ecc.verify(sign, uuid + uri + symbol, pub)).to.true;
  })
})