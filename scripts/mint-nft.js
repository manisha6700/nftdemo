require("dotenv").config()
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
// console.log(JSON.stringify(contract.abi));
const contractAddress = "0x8721E4b3ce404Ff0513aE687b9d62DEaDA0a281C"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

//create transaction
async function mintNFT(tokenURI){
    //get latest nonce
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY,"latest");

    //the trasaction
    const tx={
        'from': PUBLIC_KEY,
        'to':contractAddress,
        'nonce':nonce,
        'gas':500000,
        'data':nftContract.methods.mintNFT(PUBLIC_KEY,tokenURI).encodeABI()
    }

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })

}

    mintNFT("https://gateway.pinata.cloud/ipfs/Qmdmw4HfxyaHpJYxpP324QEyvxXqZiLT3Wsv5E96wP3pNX");
