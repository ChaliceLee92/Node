const handleBlogRouter = require('./Router/blog');
const handleUserRouter = require('./Router/user');
const querystring = require('querystring');
const { getCookieExpires, } = require('./utils/utils');
const { access } = require('./utils/log')
 
// 处理POST请求，因为是异步所以使用promise解决
const getPostData = req => {
	const promise = new Promise((resolve, reject) => {
		// 判断请求方式是否是POST
		if (req.method !== 'POST') {
			resolve({});
			return;
		}
		// 判断请求格式是否是json格式 ， 这里只支持json格式; content-type 应该是全小写
		if (req.headers['content-type'] !== 'application/json') {
			resolve({});
			return;
		}
		// 接收post参数，数据流的方式接收
		let postData = '';
		req.on('data', chunk => {
			postData += chunk.toString();
		});
		req.on('end', () => {
			if (!postData) {
				resolve({});
				return;
			}
			resolve(JSON.parse(postData));
		});
	});
	return promise;
};

// session
const SESSION_DATA = {};

const serverHandle = (req, res) => {

	// 输出请求日志
	access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)


	// 设置返回格式
	res.setHeader('Content-type', 'application/json');

	// 处理 路径
	const url = req.url;
	req.path = url.split('?')[0];

	// 解析query
	req.query = querystring.parse(url.split('?')[1]);

	// 解析cookie
	req.cookie = {};
	const cookieStr = req.headers.cookie || '';
	cookieStr.split(';').forEach(item => {
		if (!item) return;
		const arr = item.split('=');
		// 这里注意一个坑,需要把空格给去掉，否则客户端更改的 cookie 会成功,而后端设置的cookie因为前面多了个空格导致失效了
		const key = arr[0].trim();
		const val = arr[1].trim();
		req.cookie[key] = val;
	});

	// 解析session
	let { userid } = req.cookie;
	let needsession = false;
	if (userid) {
		if (!SESSION_DATA[userid]) {
			SESSION_DATA[userid] = {};
		}
	} else {
		needsession = true;
		userid = `${Date.now()}_${Math.random()}`;
		SESSION_DATA[userid] = {};
	}
	req.session = SESSION_DATA[userid];

	// 处理post data
	getPostData(req).then(postData => {
		// 赋值
		req.body = postData;

		// 博客路由
		const blogResult = handleBlogRouter(req, res);
		if (blogResult) {
			blogResult.then(blogData => {
				if (blogData) {
					if (needsession) {
						res.setHeader('Set-Cookie', `userid=${userid};path=/;httpOnly;expires=${getCookieExpires()}`);
					}
					res.end(JSON.stringify(blogData));
				}
			});
			return;
		}

		// user路由
		const userResult = handleUserRouter(req, res);
		if (userResult) {
			userResult.then(userData => {
				if (userData) {
					if (needsession) {
						res.setHeader('Set-Cookie', `userid=${userid};path=/;httpOnly;expires=${getCookieExpires()}`);
					}
					res.end(JSON.stringify(userData));
				}
			});
			return;
		}

		// 404路由
		res.writeHeader(404, { 'Content-type': 'text/plain' });
		res.write('404 Not Found');
		res.end();
	});
};

module.exports = serverHandle;
