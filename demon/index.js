const { getLastestTransactions } = require("./utils/main.js");
const { Transactions, sequelize } = require("./models");

const storeData = async (data) => await Transactions.create(data);

const CheckTask = async () => {
  let arr = [];
  // Promise로 반환을 하였기 떄문에 then으로 받아준다
  getLastestTransactions().then((result) => {
    console.log(result);
    for (let data of result) {
      arr.push(storeData(data));
    }

    if (arr.length > 0) {
      Promise.all(arr)
        .then(async () => {
          console.log("트랜잭션 처리 끝!");
          await sequelize.close();
        })
        .then(() => {
          arr = [];
        })
        .catch(async (err) => {
          console.log(err);
        });
    } else {
      console.log("데이터가 없습니다!!");
    }
  });
};

CheckTask();
