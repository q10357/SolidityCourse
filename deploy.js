const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

// code for deploying our contract
async function main() {
  // either compile contracts
  // in code
  // or compile them seperately
  const privateKey = process.env.GANACHE_PRIVATE_KEY;
  const addr = process.env.PROVIDER_ADDRESS;
  if (!privateKey || !addr) {
    throw new Error("Please define GANACHE_PRIVATE_KEY in your .env file");
  }

  const provider = new ethers.JsonRpcProvider(addr);

  const wallet = new ethers.Wallet(privateKey, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait");

  const contract = await contractFactory.deploy({ gasPrice: 10000000000 });
  const transactionReceipt = await contract.deploymentTransaction().wait(1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
