const { Wallet, utils, providers, Contract, BigNumber } = require("ethers");

// const sendEth = async (dto) => {
//   try {
//     const {to, ether} = dto
//     const provider = new providers.InfuraProvider(
//       42, // kovan
//       process.env.INFURA_ID // infura id
//     );

//     const privateKey = '012c81e5d213a74dd708a74836dc01ad7051434e2d13d20ca8a8cddc9d010d48'

//     const wallet = new Wallet(privateKey, provider)

//     tx = {
//       to: "0x8A0ED6612422b3F9f7C068a1E0c06E80974b0c61",
//       value: utils.parseEther("0.4")
//     }

//     // Sending ether
//     const txRes = await wallet.sendTransaction(tx)
//     console.dir(txRes)
//   } catch (error) {
//     console.error(error)
//     throw error;
//   }
// }

// const sendToken = async (dto) => {
//   try {
//     const {contractAddress, value, decimal, to} = dto
//     const abi = [
//       "function balanceOf(address owner) view returns (uint256)",
//       "function decimals() view returns (uint8)",
//       "function symbol() view returns (string)",
//       "function transfer(address to, uint amount) returns (boolean)",
//       "event Transfer(address indexed from, address indexed to, uint amount)"
//     ];

//     const provider = new providers.InfuraProvider(
//       5,
//       '59d08979c923495996d5ea5b94a772e1' // infura id
//     );

//     const privateKey = '012c81e5d213a74dd708a74836dc01ad7051434e2d13d20ca8a8cddc9d010d48'
//     const signer = new Wallet(privateKey, provider)

//     const erc20_rw = new Contract(contractAddress, abi, signer)

//     const howMuchTokens = utils.parseUnits(value, decimal);
//     const transactionResponse = await erc20_rw.transfer(to, howMuchTokens);

//     console.dir(transactionResponse)

//     // Log.info('transactionResponse', transactionResponse);
//     // Log.info(`Sent ${utils.formatUnits(howMuchTokens, decimal)} TRYB to
//     //   address ${to}
//     //   `);
//   } catch (error) {
//     console.error(error.toString())
//   }
// }

// sendToken({
//   contractAddress: '0x155d2a49bb97e6b2afbd50bba93191ec9dde5613',
//   value: '0.55',
//   decimal: '18',
//   to: '0x8A0ED6612422b3F9f7C068a1E0c06E80974b0c61'
// })

const balances = [
  BigNumber.from("0x016345785d8a0000"),
  BigNumber.from("0x00"),
  BigNumber.from("0x015faee16a50e000"),
  BigNumber.from("0xbb4c8f888f0000"),
  BigNumber.from("0x00"),
  BigNumber.from("0x01"),
  BigNumber.from("0x3635c9adc5dea00000"),
];

console.log(
  balances.sort((a, b) => (b.gt(a) ? 1 : -1)).map((b) => b.toString())
);
