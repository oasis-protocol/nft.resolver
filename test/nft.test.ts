import { NFT } from '../src/nft'
import ecc from 'eosjs-ecc'
import Chai from 'chai'

const expect = Chai.expect

describe('nft resolver', () => {
  it('general nft resolve', () => {
    const uri = "oasis://contract/game/WEAPON/antsword";
    const uuid = "1000"
    const nft = new NFT(uri, "SWORD", uuid);
    expect(nft.contract).to.equal("contract");
    expect(nft.game).to.equal("game");
    expect(nft.uuid).to.equal(uuid);
    expect(nft.type).to.equal("WEAPON");
    expect(nft.name).to.equal("antsword");
  })

  it('nft resolved with type `OTHER` and sub types', () => {
    const uri = "oasis://contract/game/OTHER/antsword?subtypes=[type1,type2]&type1=1&type2=2";
    const nft = new NFT(uri, "SWORD");
    expect(nft.subTypes["type1"]).to.equal('1');
    expect(nft.subTypes["type2"]).to.equal('2');
  })

  it('nft with invalid uri', () => {
    try {
      const nft = new NFT("invalid://contract/game/WEAPON/antsword", "SWORD")
    } catch (e) {
      expect(e).not.to.undefined;
    }
  })
})

describe('nft signer', () => {
  it('nft signing', async () => {
    const uri = "oasis://contract/game/WEAPON/antsword";
    const uuid = "1000";
    const symbol = "SWORD"
    const nft = new NFT(uri, symbol, uuid);
    const priv = await ecc.randomKey();
    const pub = ecc.privateToPublic(priv);
    const sign = nft.sign(priv);
    expect(ecc.verify(sign, uuid + uri + symbol, pub)).to.true;
  })
})