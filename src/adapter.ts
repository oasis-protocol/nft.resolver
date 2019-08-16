import { NFT } from "./nft";

interface ChainAPI {
  chainId: string
  name: string

  /** Retrieved current pending nfts to create on chain */
  getNFTs(): NFT[]

  /** Append nft to pending list */
  addNFT(nft: NFT): void

  /** Send transaction to blockchain */
  launch(): void
}