import express from "express";
import Web3 from "web3";
import { ERC_20_ABI, ERC_20_CA, URL } from "./잡다한것/URL.js";

//npx sequelize-cli init

// npx sequelize-cli model:generate --name Transactions --attributes hash:string,nonce:integer,blockHash:string,blockNumber:integer,transactionIndex:integer,from:string,to:string,value:string,gas:integer,gasPrice:string,input:text,v:string,r:string,s:string

// npx sequelize-cli db:migrate

//Transaction_DB

const app = express();

const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

const TokenContract = new web3.eth.Contract(ERC_20_ABI, ERC_20_CA);

const mintToken = async () => {
  console.log("mintToken");

  let tx = await web3.eth.accounts.signTransaction(
    {
      from: "0xb78B0329aD037F2c799884e4C53cC2c314925694",
      to: ERC_20_CA,
      gas: 500000,
      data: TokenContract.methods
        .mintToken("0x1da8Afe2Af69ef801400a32862e1D9DE49BEA32a", ERC_20_CA, 10)
        .encodeABI(),
    },
    "2bc58aaed31f1c6abdef65affa3d8ed477ace6dac97e223f49ef4570c57613eb"
  );

  const hoijn = await web3.eth.getTransaction(tx);
  console.log(hoijn);
  let tran = await web3.eth.sendSignedTransaction(
    tx.rawTransaction,
    (err, hash) => {
      if (!err) console.log(hash);
      else console.log(err);
    }
  );

  console.log("mint_Token성공");
  // let tx = {
  //   from: adminAddress,
  //   to: ERC_20_CA,
  //   gas: 50000,
  //   data: TokenContract.methods
  //     .transferFrom(
  //       wallet_address,
  //       "0x4D88b3140F53D3d86E42222a8cf9c6970C87d984",
  //       100000
  //     )
  //     .encodeABI(),
  // };s
  // transferFrom은 컨트랙트 배포자가 실행을 함으로써 서버계정에서 사용자 계정응로 값을 보내는 역할

  // await web3.eth.accounts.signTransaction(tx, adminPri).then(async (raw) => {
  //   await web3.eth.sendSignedTransaction(raw.rawTransaction, (err, hash) => {
  //     if (!err) {
  //       console.log(hash);
  //     } else {
  //       console.log(err);
  //     }
  //   });
  // });
  console.log("transferfrom 성공!");
  // await TokenContract.methods
  //   .balanceOf("0x4D88b3140F53D3d86E42222a8cf9c6970C87d984")
  //   .call()
  //   .then(console.log);
};
// setTokenToNFT();
mintToken();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(PORT);
});
