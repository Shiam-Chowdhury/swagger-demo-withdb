const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./api.yaml");
const question = require('./routes/questionHandler');
const author = require('./routes/authorHandler');

//to initialize express app
const app = express();
dotenv.config();
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

//db connection
mongoose.connect('mongodb://localhost:27017/swagger-cbt')
    .then(() => {
        console.log('connected to db');
    }).catch(err => console.log(err));

app.use('/author', author);
app.use('/question', question);

app.listen(4001, () => {
    console.log('app running on port 4001');
})