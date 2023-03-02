const { v4: uuidv4 } = require('uuid');
const promisePool = require('../configs/db_connection');

getAll = async (req, res) => {
  const [rows, fields] = await promisePool.query(`SELECT * FROM user`);
  const users = rows.map((row) => {
    delete row.password;
    return row;
  });
  res.status(200).json({
    data: users,
  });
};

search = async (req, res) => {
  // search and return here
  var name_search = req.query.name; // lấy giá trị của key name trong query parameters gửi lên
  const [rows] = await promisePool.query(`SELECT * FROM user WHERE name=?`, [
    name_search,
  ]);

  res.send(rows);
};

create = (req, res) => {
  // add new user here
  // var user = req.body;
  // if (!user.name || !user.email || !user.password) {
  //   return res.send('Error');
  // }
  // console.log(req.body);
  // users.push({ id: uuidv4(), ...req.body });
  // res.send(users);
};

findOne = async (req, res) => {
  const id = req.params.id;
  const [rows] = await promisePool.query(`SELECT * FROM user WHERE id=?`, [id]);

  res.send(rows[0] || 'Not found');
};

module.exports = {
  getAll,
  search,
  create,
  findOne,
};
