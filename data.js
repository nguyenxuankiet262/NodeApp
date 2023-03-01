const { v4: uuidv4 } = require('uuid');

exports.users = [
  {
    id: '100',
    username: 'User10',
    password: 123456,
    name: 'User10',
    email: 'user10@gmail.com',
    refreshToken: null,
    accessToken: null,
  },
  {
    id: uuidv4(),
    username: 'User1',
    password: 123456,
    name: 'User10',
    email: 'user10@gmail.com',
    refreshToken: null,
    accessToken: null,
  },
  {
    id: uuidv4(),
    username: 'User2',
    password: 123456,
    name: 'User10',
    email: 'user10@gmail.com',
    refreshToken: null,
    accessToken: null,
  },
  {
    id: uuidv4(),
    username: 'User2',
    password: 123456,
    name: 'User10',
    email: 'user10@gmail.com',
    refreshToken: null,
    accessToken: null,
  },
];
