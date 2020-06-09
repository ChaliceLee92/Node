let fs = require('fs');
let path = require('path');
let readline = require('readline');

const fileName = path.resolve(__dirname, '../', '../', 'logs', 'access.log'); // 要写入内容的文件
const readStream = fs.createReadStream(fileName);
const rl = readline.createInterface({
	input: readStream
});

let chromeNum = 0;
let sum = 0;

rl.on('line', lineData => {
	if (!lineData) {
		return;
	}
	// 记录总行数 ， 空行不算数
	sum++;

	const arr = lineData.split('--');
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        // 记录Chrome用户数量
		chromeNum++;
	}
});

rl.on('close', () => {
	console.log('Chrome占比是：' + chromeNum / sum + '%'); // 用户占比
});
