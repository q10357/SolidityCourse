const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

// code for deploying our contract
async function main() {
  // either compile contracts
  // in code
  // or compile them seperately
  const addr = process.env.PROVIDER_ADDRESS
  if (!addr) {
    throw new Error("Please define GANACHE_PRIVATE_KEY in your .env file")
  }

  const provider = new ethers.JsonRpcProvider(addr)

  // const wallet = new ethers.Wallet(privateKey, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD,
  )
  wallet = wallet.connect(provider)

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  )
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait")

  const contract = await contractFactory.deploy({ gasPrice: 10000000000 })
  const transactionReceipt = await contract.deploymentTransaction().wait(1)

  console.log("Contract interface (ABI) : ")
  console.log(contract.interface)
  console.log("Here is the transaction receipt: ")
  console.log(transactionReceipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
