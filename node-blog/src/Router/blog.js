const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { LoginCheck } = require('../utils/utils');

const handleBlogRouter = (req, res) => {
	// 获取请求类型
	const method = req.method;
	const id = req.query.id;
	const newData = req.body;

	// 获取博客列表
	if (method === 'GET' && req.path === '/api/blog/list') {
		// 接收参数
		const author = req.query.author || '';
		const keyword = req.query.keyword || '';

		// isadmin 参数用于判断是否获取只属于自己的博客列表
		if (req.query.isadmin) {
			// 判断是否登录管理员页面
			const LoginResult = LoginCheck(req);
			if (LoginResult) {
				return LoginResult
			}
			author = req.session.username
		}


		// 去数据查询数据
		const result = getList(author, keyword);

		// 返回结果模型
		return result.then(listData => {
			return new SuccessModel(listData);
		});
	}

	// 获取博客详情
	if (method === 'GET' && req.path === '/api/blog/detail') {
		const result = getDetail(id);
		return result.then(data => {
			return new SuccessModel(data);
		});
	}

	// 新建博客
	if (method === 'POST' && req.path === '/api/blog/new') {
		const LoginResult = LoginCheck(req);
		if (LoginResult) {
			return LoginResult;
		}

		newData.author = req.session.username;

		const result = newBlog(newData);
		return result.then(data => {
			return new SuccessModel(data);
		});
	}

	// 更新
	if (method === 'POST' && req.path === '/api/blog/update') {
		const LoginResult = LoginCheck(req);
		if (LoginResult) {
			return LoginResult;
		}

		const result = updateBlog(id, newData);
		return result.then(data => {
			if (!data) {
				return ErrorModel('更新博客失败');
			}
			return new SuccessModel(data);
		});
	}

	// 删除
	if (method === 'POST' && req.path === '/api/blog/del') {
		const LoginResult = LoginCheck(req);
		if (LoginResult) {
			return LoginResult;
		}

		const author = req.session.username;
		const result = delBlog(id, author);
		return result.then(data => {
			if (!data) {
				return new ErrorModel('删除博客失败');
			}
			return new SuccessModel(data);
		});
	}
};

module.exports = handleBlogRouter;
