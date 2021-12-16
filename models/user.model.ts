import connection from '../_utils/db-config'

const findMany = () => {
    const sql ='SELECT * FROM user'
   return connection.promise().query(sql, []).then(([results]:any) => results)
}

module.exports = {
    findMany
}


