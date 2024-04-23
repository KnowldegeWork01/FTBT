const express = require('express')
const {getPM,loginPM} = require("../Controllers/ProjectManager")
const PM_Router = express.Router()

PM_Router.get("/:token",getPM)
PM_Router.post("/login",loginPM)

module.exports = PM_Router