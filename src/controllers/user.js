const { v4: uuidv4 } = require('uuid');
const { users } = require('../../data');

module.exports = {
  getAll: function (req, res) {
    res.send(users);
  },
  search: (req, res) => {
    // search and return here
    var name_search = req.query.name; // lấy giá trị của key name trong query parameters gửi lên
    var mail_search = req.query.email; // lấy giá trị của key name trong query parameters gửi lên
    var result;
    if (name_search) {
      result = users.filter((user) => {
        // tìm kiếm chuỗi name_search trong user name.
        // Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
        return (
          user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
        );
      });
    }
    if (mail_search) {
      result = (result || users).filter((user) => {
        // tìm kiếm chuỗi name_search trong user name.
        // Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
        return (
          user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
        );
      });
    }

    res.send(result || []);
  },
  create: (req, res) => {
    // add new user here
    var user = req.body;
    if (!user.name || !user.email || !user.password) {
      return res.send('Error');
    }
    console.log(req.body);
    users.push({ id: uuidv4(), ...req.body });
    res.send(users);
  },

  findOne: (req, res) => {
    var findUser = users.find((user) => user.id === req.params.id);

    res.send(findUser || 'Not found');
  },
};
