const loginFXN=require("../controllers/loGin")
// const {logActivity}= require('../middleware/sessionChecker')
const express = require("express")
const { Module } = require("module")
const router = express.Router()

router.post("/loginUser",loginFXN)

module.exports=router