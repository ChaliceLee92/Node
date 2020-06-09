const { exec } = require('../db/mysql');

// 获取文章列表,支持传入author或者keyword进行查询。
const getList = (author, keyword) => {
	// 查询数据库,返回数据
	let sql = 'select * from blogs where 1=1 '; // 这里 1=1 是因为避免author和keyword没有传入的时候导致报错

	// 接收作者名称
	if (author) {
		sql += `and author='${author}'`;
	}

	// 模糊查询文章标题
	if (keyword) {
		sql += `and title like '%${keyword}%'`;
	}

	// 根据时间顺序 返回
	sql += `order by createtime desc;`;

	// 返回
	return exec(sql);
};

// 获取文章详情
const getDetail = id => {
	const sql = `select * from blogs where id=${id}`;
	return exec(sql).then(rows => {
		return rows[0];
	});
};

// 新建博客
const newBlog = (newData = {}) => {
	const { title, content, author } = newData;
	const createtime = Date.now();

	const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}')`;

	return exec(sql).then(result => {
		return {
			id: result.insertId
		};
	});
};

// 更新
const updateBlog = (id, newData = {}) => {
	const { title, content } = newData;
	const sql = `update blogs set title='${title}' , content='${content}' where id=${id}`;

	return exec(sql).then(result => {
		if (result.affectedRows > 0) {
			return true;
		}
		return false;
	});
};

// 删除
const delBlog = (id, author) => {
	console.log('%c 🍉 id: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', id);

	const sql = `delete from blogs where id=${id} and author='${author}'`;

	return exec(sql).then(result => {
		if (result.affectedRows > 0) {
			return true;
		}
		return false;
	});
};

module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	delBlog
};
