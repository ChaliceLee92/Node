const fs = require('fs');
const path = require('path');

// 写日志的函数
function writeLog(writeStream, log) {
	writeStream.write(log + '\n');
}

// 创建写入的流
function createWriteStream(fileName) {
	const fullFileName = path.resolve(__dirname, '../', '../', 'logs', fileName); // 要写入内容的文件
	const writeStream = fs.createWriteStream(fullFileName, {   // 创建一个写入数据流对象
		flags: 'a'
	});
	return writeStream;
}

// 访问的日志
const accessWriteStream = createWriteStream('access.log');
function access(log) {
	writeLog(accessWriteStream, log);
}

// 错误的日志    
const errorWriteStream = createWriteStream('error.log')
function error(log) {
    writeLog(errorWriteStream,log)
}

module.exports = {
    access,
    error
};
