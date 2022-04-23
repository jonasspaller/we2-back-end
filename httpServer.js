const express = require('express');
const database = require('./database/db');
const app = express();
const port = 8080;

const testRoutes = require('./endpoints/test/TestRoutes');
const userRoutes = require('./endpoints/user/UserRoutes');
const publicUsersRoute = require('./endpoints/user/publicUsersRoute');

database.initDB((err, db) => {
	if(db) console.log("database connection established");
});

app.use('/',testRoutes);
app.use('/user', userRoutes);
app.use('/publicUsers', publicUsersRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});