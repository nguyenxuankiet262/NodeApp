const express = require('express');

const app = express();
const port = 8080;

const userRoute = require('./src/routes/user');
const authRoute = require('./src/routes/auth');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Dùng userRoute cho tất cả các route bắt đầu bằng '/users'
app.use('/users', userRoute);
app.use('/auth', authRoute);

app.listen(port, function () {
  console.log('Your app running on port ' + port);
});
