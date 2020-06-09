const { SuccessModel, ErrorModel } = require('../model/resModel');

// 检测一个值是否为空
function isEmpty(value) {
	if (Array.isArray(value)) {
		return value.length === 0;
	} else if (typeof value === 'object') {
		if (value) {
			for (const _ in value) {
				return false;
			}
		}
		return true;
	} else {
		return !value;
	}
}

// 设置cookie的过期时间
const getCookieExpires = () => {
	const d = new Date();
	d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 1000); // 三天后过期
	return d.toGMTString();
};

// 登录验证
const LoginCheck = req => {
	if (!req.session.username) {
		return Promise.resolve(new ErrorModel('尚未登录'));
	}
};

module.exports = {
	isEmpty,
	getCookieExpires,
	LoginCheck
};
