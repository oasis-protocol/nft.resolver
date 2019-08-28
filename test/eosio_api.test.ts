import AssetEosAPI from '../src/chain_api/eosio_api';
import Chai from 'chai';

const expect = Chai.expect;

describe('EOSIO Api test', () => {
  let eosAPI: AssetEosAPI;
  const fetchMock = fetch as any;

  beforeEach(() => {
    fetchMock.resetMocks();
    eosAPI = new AssetEosAPI('',
      { actor: 'eosio', permission: 'active', privateKey: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3' },
      { actor: 'eosio', permission: 'active', privateKey: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3' });
  })

  it('create asset', async () => {
    fetchMock.once(JSON.stringify({ data: 'success' }));
    // FIXME: Bugs in jest-fetch-mock modules.
    // const resp = await eosAPI.createAsset('test', 'eosio', 1000, 'BTC', 1);
    // expect(resp).to.equal('success');
  })

  it('issue coin', async () => {

  })

  it('issue nft', async () => {

  })
})