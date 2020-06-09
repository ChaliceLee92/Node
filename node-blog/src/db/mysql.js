const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

// 创建数据库链接
const con = mysql.createConnection(MYSQL_CONF);
// const con = mysql.createConnection({
// 	host: 'localhost', // 数据库地址
// 	user: 'root', // 数据库用户名
// 	password: '1234567890', // 数据库密码
// 	port: '3306', // 数据库端口号
// 	database: 'myblog' // 数据库名称
// });

// 开始连接数据库
con.connect();

// 统一执行sql函数
function exec(sql) {
	const promise = new Promise((resolve, reject) => {
		con.query(sql, (err, result) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});
	});
	return promise;
}

module.exports = {
	exec
};
