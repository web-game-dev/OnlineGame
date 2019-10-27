const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`Connected to port ${port}.`);
});