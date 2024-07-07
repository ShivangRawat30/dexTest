const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config({ path: './config/config.env' });

const user = require("./routes/userRoutes")
app.use("/api", user);

module.exports = app;