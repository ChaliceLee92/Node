# node-blog

- 本项目根据慕课网视频 **《nodeJS从零开发Web Server博客项目课程》** 双越老师教程学习,如有侵权行为,可联系删除.

- 这个项目是由原生的NodeJS开发,没有使用框架,主要是用来入门理解NodeJS后端开发的流程以及一些模块化思想的理解.

- 下面总结下当前进度的理解：
```
    1. 项目主要分为四个层面：
        1.1: bin目录 主要存放www.js文件,该文件主要职责就是处理http
        1.2: src目录 是我们的主要战场.
            1.2.1: app.js 主要处理http的请求以及响应。
            1.2.2: Controller 主要是处理数据的。
            1.2.3: model 主要是处理返回的数据模型,规范返回的数据结构给前端
            1.2.4: Router 主要是处理路由.
```

---

# 连接数据库

- 具体安装根据各种系统安装即可

- 安装好之后创建表;然后使用sql语句实现对数据库的增删改查。

- 查询所有表格: SHOW TABLES

- 增: INSERT INTO users (username,`password`,realname) VALUES ('lisi','123456','李四');

- 查: 

```
SELECT * FROM users 或者 SELECT username,`password` FROM users; 
* 号代表查询所有字段, 会有性能问题，如果不需要使用全部字段可以使用具体的字段名来查询,这里password是关键字,所以要是用反引号来使用;
查询username为zhangsan的用户信息: SELECT * FROM users WHERE username='zhangsan';
如果是查询username和password的用户信息: SELECT * FROM users WHERE username='zhangsan' AND `password`='123456'
如果是查询username 或者 password 的用户信息: SELECT * FROM users WHERE username='zhangsan' OR `password`='123456'

如果需要模糊查询username中带zhang的用户信息: SELECT * FROM users WHERE username LIKE '%zhang%'

排序查询(正序): SELECT * FROM users WHERE `password` LIKE '%1%' ORDER BY id 

排序查询(倒序): SELECT * FROM users WHERE `password` LIKE '%1%' ORDER BY id DESC

```

- 更新:

```
UPDATE users SET realname='李四2' WHERE username='lisi'

```

- 删除:

```
DELETE FROM users WHERE username='lisi'


一般我们在删除的时候会有个变相删除的操作（软删除）,就是先给用户信息再加一个字段标识是否删除,然后查询的时候根据这个字段来查询是否删除。

使用更新sql语句把用户状态改为0表示删除: UPDATE users SET status='0' WHERE username='lisi'
然后就可以再用查询语句查询用户状态为1的用户: SELECT * FROM users WHERE status='1'

这样操作的好处就是可以把数据给恢复过来。

<> 这个符号在sql中表示不等于的意思: SELECT * FROM users WHERE status<>'0'

```

---

# NodeJS操作mysql

- 先在项目中安装mysql: npm install mysql

- 创建文件夹 conf 根据环境变量来配置mysql数据库。

- 创建db文件夹连接数据库。

# 使用cookie做登陆验证

- 只要用户登陆成功,后端就设置cookie 返回给客户端,后端凭借cookie的字段值来判断用户是否登陆。

- 因为cookie在客户端可以修改,所以后端要为cookie做限制,防止客户端更改后端返回的cookie值从而绕过登陆。

- 小坑: 后端在处理cookie的时候需要把获取到的cookie去掉空格,否则会导致后端设置的cookie失效.

# session

- cookie 会暴露username,可以使用session来解决这个问题, 在cookie中存储userID , server端对应username。

# redis

- 如果session是存储在变量中会有问题：

- 1. 进程内存有限，访问量过大会导致内存暴增；操作系统会限制一个进程的最大可用内存，32位的操作系统只有1.6G的内存限制，而64位的操作系统最多也不会超过3G
- 2. 正式线上运行是多进程的，进程之间内存无法共享。

- 3. Redis:
    - 3.1  它是web server最常用的缓存数据库，数据存放在内存中
    - 3.2  相比于mysql访问速度快，因为它是内存数据库，而mysql是硬盘数据库。
    - 3.3  成本高，可存储的数据量小（内存的硬伤）

- 4. 为什么session适合用Redis？
    - 4.1.session访问频繁，对性能要求极高。
    - 4.2.session可以不考虑断电丢失数据的问题。
    - 4.3.session数据量不会太大（相比于mysql中存储的数据）

npm install redis


# Nginx

- 配置文件路径: 

    - windows: c:\nginx\conf\nginx.conf
    - mac: /usr/local/etc/nginx/nginx.conf

- 测试配置文件格式是否正确 nginx -t
- 启动: nginx:
- 重启: nginx -s reload
- 停止: nginx -s stop 


# 打印日志

- 使用stream的方式，记录项目的日志
- 具体看utils文件夹下的log.js

# 拆分日志

- 使用Linux下的crontab命令拆分日志，即定时任务。

- 设置定时任务，格式： *****command ， 第一个 * 代表分钟，第二个代表小时，第三个代表日期 ， 第四个代表月份 ， 第五个代表星期

- 1. 新建sh脚本
- 2. 查看日志目录的路径备用:/Users/liyanhuan/Desktop/Node/node-blog/logs
- 3. 在utils新建脚本。
```
#!/bin/sh    执行shell命令
cd /Users/liyanhuan/Desktop/Node/node-blog/logs   进入logs文件夹
cp access.log $(date +%Y-%m-%d).access.log  拷贝文件并重新命名
echo "" > access.log  情况原来的文件内容
```

- 4. 然后使用进入utils下的copy.sh文件,执行命令 sh copy.sh

- 5. 脚本可以跑通了后配置crontab命令: 
    - 5.1. 先记录下脚本放置的地址: /Users/liyanhuan/Desktop/Node/node-blog/src/utils/copy.sh
    - 5.2. 使用命令: crontab -e 编辑 ： * 0 * * * sh /Users/liyanhuan/Desktop/Node/node-blog/src/utils/copy.sh
    - 5.3. 保存后使用: crontab -l 可以查看定时任务

# 日志分析

- 针对access.log日志分析Chrome用户的占比，日志是按行存储的，一行代表了一条日志，我们可以使用nodejs中的readline来一行一行的读取（它是基于stream，所以效率很高），读取一行记一个数，读取遇到Chrome用户的日志再记一个数，然后总数除以Chrome的用户数就能够得到占比了。