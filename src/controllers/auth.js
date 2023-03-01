const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const { v4: uuidv4 } = require('uuid');
const { constants } = require('../../const');
const { users } = require('../../data');
const SALT_ROUNDS = 10;

generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return await sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
};

module.exports = {
  register: function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password)
      return res.status(409).send('Username or password null!');
    const user = users.find((user) => user.username === username);

    if (user) return res.status(409).send('Username existed.');

    const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

    const newUser = {
      id: uuidv4(),
      username: username,
      password: hashPassword,
    };
    users.push(newUser);

    return res.status(200).send(newUser);
  },
  login: async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password)
      return res.status(409).send('Username or password null!');
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(401).send('Username not exist');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Password is not correct');
    }

    const dataForAccessToken = {
      username: user.username,
    };
    const accessToken = await generateToken(
      dataForAccessToken,
      constants.accessTokenSecret,
      constants.accessTokenLife
    );
    if (!accessToken) {
      return res.status(401).send('Something went wrong!');
    }

    let refreshToken = randToken.generate(constants.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
    if (!user.refreshToken) {
      // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
      // await userModel.updateRefreshToken(user.username, refreshToken);

      var index = users.findIndex((u) => u.id === user.id);
      users[index] = {
        ...user,
        refreshToken,
      };
    } else {
      // Nếu user này đã có refresh token thì lấy refresh token đó từ database
      refreshToken = user.refreshToken;
    }

    return res.json({
      msg: 'Đăng nhập thành công.',
      accessToken,
      refreshToken,
      user,
    });
  },
};
