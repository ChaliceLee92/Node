const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { isEmpty } = require('../utils/utils');

const handleUserRouter = (req, res) => {
	// 登录
	if (req.method === 'POST' && req.path === '/api/user/login') {
		const { username, password } = req.body;

		const result = login(username, password);

		return result.then(data => {
			const isData = isEmpty(data);
			if (isData) {
				return new ErrorModel('登录失败,请验证账户或者密码是否正确');
			}
			// 设置cookie并设置cookie的过期时间
			req.session.username = data.username;
			req.session.realname = data.realname;

			return new SuccessModel('登录成功');
		});
	}
};

module.exports = handleUserRouter;
