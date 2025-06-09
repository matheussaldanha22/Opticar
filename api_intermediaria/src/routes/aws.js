var express = require("express")
var router = express.Router()

var awsController = require("../controllers/awsController")

router.post("/dadosS3", function (req, res) {
  awsController.dadosBucket(req, res)
})

router.get("/pegarS3/:ano/:mes", function (req,res) {
  awsController.pegarS3(req,res)
})

module.exports = router