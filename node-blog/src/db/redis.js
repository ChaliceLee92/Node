const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 连接redis客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

redisClient.on('error', err => {
	console.log(err);
});

// 设置redis
function set(key, val) {
	if (typeof val === 'object') {
		val = JSON.stringify(val);
	}
	redisClient.set(key, val, redis.print);
}

// 获取redis ， 异步使用promise
function get(val) {
	const promise = new Promise((resolve, reject) => {
		redisClient.get(key, (err, val) => {
			if (err) {
				reject(err);
				return;
			}
			// 处理异常值的情况
			if (val === null) {
				resolve(null);
				return;
			}
			try {
				resolve(JSON.parse(val));
			} catch (error) {
				resolve(val);
			}
		});
	});
	return promise;
}

module.exports = {
	set,
	get
};
