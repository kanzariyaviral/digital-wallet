const express = require("express");
const router = express.Router();
const resource=require("../controllers/resource.controller")

router.post("/create",resource.createResource)
router.post("/login",resource.login)
router.get("/",resource.getAllResource)
router.get("/by/:id",resource.getResourceByID)
module.exports = router;