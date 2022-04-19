const express = require('express');
const database = require('./database/db');
const app = express();
const port = 8080;

const testRoutes = require('./endpoints/test/TestRoutes');
const userRoute = require('./endpoints/user/UserRoute');

app.use('/',testRoutes);
app.use('/user', userRoute);

database.initDB((err, db) => {
	if(db){
		console.log("database connection established");
	} else {
		console.log("database connection failed");
	}
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});