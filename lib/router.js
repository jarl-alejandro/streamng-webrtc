'use strict'

const os = require("os")
const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
	return res.render("index")
})

router.get("/stream", (req, res) => {
	res.render("stream")
})


router.get("/ipaddr", (req, res)=> {
	const ifaces = os.networkInterfaces()

	for(let dev in ifaces) {

		ifaces[dev].forEach((details) => {
			if(details.family == 'IPv4' && details.address != '127.0.0.1')
				res.send( details.address )
		})

	}


})

module.exports = router