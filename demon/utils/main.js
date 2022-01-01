const fs = require("fs");
const Web3 = require("web3");
const path = require("path");
const basePath = "/Users/yuhojin/Desktop/test/demon/utils";

// path, basepath의 역할을 해당 파일의 명을 정확하게 지정해 주기 위함이다.

// getLastestTransactions부분은 index.js에서도 사용이 되어야 할 것이다.

// 하지만 index.js에서는 blockNumber의 경로가 다르다.

// 단순하게 fs.readFileSync("./blockNumber")로 작성을 한다면
// main.js는 원활하게 작동이 되겠지만 경로가 다른 index.js에서는 자신의 경로에 blockNumber이 없기 떄문에 오류가 발생을 한다.

const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

const checkBlockNum = Number(
  fs.readFileSync(path.join(basePath, "./blockNumber"), { encoding: "utf-8" })
);

const contractAddress = fs.readFileSync(
  path.join(basePath, "./contractAddress"),
  {
    encoding: "utf-8",
  }
);

const allTrs = [];
let recent = checkBlockNum;

const getTx = async (tx) => await web3.eth.getTransaction(tx);

const getLastestTransactions = async () => {
  try {
    await web3.eth.getBlockNumber((err, result) => {
      if (err) console.log(err);
      if (result > recent) {
        recent = result;
      }
    });
    if (checkBlockNum == recent) {
      return [];
    } else {
      for (let i = checkBlockNum + 1; i <= recent; i++) {
        const block = await web3.eth.getBlock(i);

        for (let tx of block.transactions) {
          // []
          allTrs.push(getTx(tx));
        }
      }

      return Promise.all(allTrs)
        .then((data) => {
          // 이곳에 들어오는 data는 블록에 담긴 모든 트랜잭션을 의미한다.
          const result = [];
          for (let tx of data) {
            if (tx.from === contractAddress || tx.to === contractAddress) {
              result.push(tx);
            }
          }
          return result;
        })
        .then((data) => {
          fs.writeFileSync(
            path.join(basePath, "./blockNumber"),
            String(recent)
          );
          return data;
        });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getLastestTransactions };
