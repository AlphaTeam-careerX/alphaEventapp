const alleventFXN=require("../controllers/allEventz")
const express = require("express")
const { Module } = require("module")
const router = express.Router()

router.get("/allEvents",alleventFXN)

module.exports=router