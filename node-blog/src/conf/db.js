// 获取环境变量
const env = process.env.NODE_ENV;

let MYSQL_CONF;
let REDIS_CONF;

// 测试环境数据库
if (env === 'dev') {
	MYSQL_CONF = {
		host: 'localhost', // 数据库地址
		user: 'root', // 数据库用户名
		password: '1234567890', // 数据库密码
		port: '3306', // 数据库端口号
		database: 'myblog' // 数据库名称
	};

	REDIS_CONF = {
		port: 6379,
		host: '127.0.0.1'
	};
}

//  正式环境数据库
if (env === 'production') {
	MYSQL_CONF = {
		host: 'localhost', // 数据库地址
		user: 'root', // 数据库用户名
		password: '1234567890', // 数据库密码
		port: '3306', // 数据库端口号
		database: 'myblog' // 数据库名称
	};

	REDIS_CONF = {
		port: 6379,
		host: '127.0.0.1'
	};
}

module.exports = {
	MYSQL_CONF,
	REDIS_CONF
};
