import Chai from 'chai';
import { NftURI, NftType } from '../src/uri-resolver';

const expect = Chai.expect;

describe('uri resolver', () => {
  it('create NftURI from uri string', () => {
    const base = "oasis://contract/game/ARMOR/antsword?subtypes=[type1,type2]&type1=1&type2=2";
    const uri = new NftURI(base);
    expect(uri.contract).to.equal("contract");
    expect(uri.game).to.equal("game");
    expect(uri.type).to.equal("ARMOR");
    expect(uri.category).to.equal("antsword");
    expect(uri.subTypes.size).to.equal(2);
    expect(uri.getSubType("type1")).to.equal('1');
    expect(uri.getSubType("type2")).to.equal('2');
  })

  it('create NftURI from meta data', () => {
    const subTypes = new Map<string, string>();
    subTypes.set('type1', '1');
    subTypes.set('type2', '2');
    const uri = NftURI.fromMeta("contract", "game", NftType.ARMOR, "antsword", subTypes);
    expect(uri.contract).to.equal("contract");
    expect(uri.game).to.equal("game");
    expect(uri.type).to.equal("ARMOR");
    expect(uri.category).to.equal("antsword");
    expect(uri.subTypes.size).to.equal(2);
    expect(uri.getSubType("type1")).to.equal('1');
    expect(uri.getSubType("type2")).to.equal('2');
  })
})