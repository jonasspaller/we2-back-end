const express = require('express');
const database = require('./database/db');
const app = express();
const port = 8080;

const testRoutes = require('./endpoints/test/TestRoutes');
const userRoute = require('./endpoints/user/UserRoute');

app.use('/',testRoutes);
app.use('/user', userRoute);

database.initDB()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});