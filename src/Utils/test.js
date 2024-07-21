// const MoMoOrderInfo = require('../models/MoMoOrderInfo');

// const test =  async ()=>{
//     const orderInfo = await MoMoOrderInfo.findByPk( "HD228391HK32LE71591");
// console.log(JSON.stringify(orderInfo));
// }

// test();


const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // milliseconds

// Hàm hỗ trợ tạo độ trễ
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function AsyncFunction(id) {
    for (let i = 1; i <= 5; i++) {
        console.log(`ID ${id}: ${i}`);
        await sleep(1000); // Delay 1 giây giữa các log
    }
}

async function TestFunctionWithMultiFunction() {
    // Thực hiện AsyncFunction với ID 1 và ID 2 đồng thời
    const promise1 = AsyncFunction(1);
    await sleep(2000); // Chờ 2 giây
    const promise2 = AsyncFunction(2);

    // Đợi cả hai hàm asyncFunction hoàn tất
    await Promise.all([promise1, promise2]);
}

// Chạy hàm test
TestFunctionWithMultiFunction();
