const express = require('express');
const app = express();
const router = require('./route');

const bodyParser = require('body-parser');

const sequelize = require('./models').sequelize;
sequelize.sync();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
})