const promisePool = require('../configs/db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const bodyParser = require('body-parser');

const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const { constants } = require('../../const');
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

register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(409).send('Username or password null!');

  const [rows, fields] = await promisePool.query(
    `SELECT * FROM user WHERE username='${username}'`
  );

  var user = rows[0];

  if (user) return res.status(409).send('Username existed.');

  const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

  const newUser = {
    username: username,
    password: hashPassword,
  };
  await promisePool.query(
    `INSERT INTO user(username, password) VALUES ('${newUser.username}', '${newUser.password}')`
  );
  return res.status(200).send(newUser);
};

login = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(409).send('Username or password null!');

  const [rows, fields] = await promisePool.query(
    `SELECT * FROM user WHERE username='${username}'`
  );

  var user = rows[0];

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
  if (!user.refresh_token) {
    // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
    // await userModel.updateRefreshToken(user.username, refreshToken);

    await promisePool.query(
      `UPDATE user SET refresh_token='${refreshToken}' WHERE id=${user.id}`
    );
  } else {
    // Nếu user này đã có refresh token thì lấy refresh token đó từ database
    refreshToken = user.refresh_token;
  }

  return res.json({
    msg: 'Đăng nhập thành công.',
    accessToken,
    refreshToken,
    user,
  });
};

uploadFile = (req, res) => {
  const file = req.file;
  console.log('kiet ~ file: auth.js:112 ~ file:', file);
  if (!file) {
    return res.status(500).json({ message: 'File not found' });
  }
  //   const [req, res] = upload.single('myFile');
  res.status(200).json({
    url: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/9/29/1099051/209419948_8601681615.jpg',
  });
};

uploadMultipleFile = (req, res) => {
  const files = req.files;
  if (!files) {
    return res.status(500).json({ message: 'File not found' });
  }

  //   const [req, res] = upload.single('myFile');
  res.status(200).json(
    files.map((file) => {
      return 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/9/29/1099051/209419948_8601681615.jpg';
    })
  );
};

module.exports = {
  register,
  login,
  uploadFile,
  uploadMultipleFile,
};
