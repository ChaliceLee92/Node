var sqlMap = {
  user: {
      add: 'insert into userList (username, password) values (?,?)',
      select_name: 'select * from userList', 
      update_user: 'update userList set'
  }
}

module.exports = sqlMap;