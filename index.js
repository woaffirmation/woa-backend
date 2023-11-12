const express = require('express');
const router = require('./src/router/routes');
const sequelize = require('./src/config/db.config')
require('dotenv').config({
    path: '.env'
})

const app = express();

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(router);

sequelize.authenticate()
    .then(() => {
        console.log('Successfully Connected to database')
    })
    .catch((err) => { console.log('Failed Connecting to database', err) })

const port = process.env.EXPRESS_PORT;

const server = app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

module.exports = { server }