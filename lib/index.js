'use strict'

/* Dependencies */
const path = require("path")
const express = require("express")
const jade = require("jade")
const cors = require("cors")
const bodyParser = require("body-parser")

const router = require("./router")

class StreamingApp {

  constructor(config){
    config = config || {}
    this.app = express()

    this.app.use(cors())

    this.setUpView()
    this.setUp()
  }

  setUp(){
    this.app.use(express.static(path.join( __dirname, "..", "public" )))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(router)
  }

  setUpView(){
    this.app.set('view engine', 'jade')
    this.app.set('views', path.join( __dirname, "..", "views" ))
  }

}

module.exports = StreamingApp
