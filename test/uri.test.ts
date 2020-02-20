import Chai from 'chai';
import { NftURI, NftType } from '../src/uri-resolver';

const expect = Chai.expect;

describe('uri resolver', () => {
  it('create NftURI from uri string', () => {
    const base = "oasis://game/ARMOR/antsword/other1/other2?subtypes=type1,type2&type1=1&type2=2";
    const uri = new NftURI(base);
    expect(uri.game).to.equal("game");
    expect(uri.type).to.equal("ARMOR");
    expect(uri.category).to.equal("antsword");
    expect(uri.params.size).to.equal(3);
    expect(uri.fragments.length).to.equal(2);
    expect(uri.fragments[0]).to.equal('other1');
    expect(uri.fragments[1]).to.equal('other2');
    expect(uri.getParam("type1")).to.equal('1');
    expect(uri.getParam("type2")).to.equal('2');
  })

  it('create NftURI from meta data', () => {
    const subTypes = new Map<string, string>();
    subTypes.set('type1', '1');
    subTypes.set('type2', '2');
    const uri = NftURI.fromMeta("game", NftType.ARMOR, "antsword", subTypes);
    expect(uri.game).to.equal("game");
    expect(uri.type).to.equal("ARMOR");
    expect(uri.category).to.equal("antsword");
    expect(uri.params.size).to.equal(2);
    expect(uri.getParam("type1")).to.equal('1');
    expect(uri.getParam("type2")).to.equal('2');
  })
})