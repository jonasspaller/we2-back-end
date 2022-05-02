var express = require('express')
var router = express.Router()

// GET requests
router.get('/', (req, res) => {
	res.status(200)
	res.send({"Message": "Du bist in /authenticate"})
})

module.exports = router