const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./Database/db')
const colors = require('colors');
const cors = require("cors");
const path = require('path');

require('./models/model')
require('./models/post')
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))

connectDB();

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`.bgMagenta.white)
})