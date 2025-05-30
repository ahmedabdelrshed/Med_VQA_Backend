const express = require("express");
const router = express.Router();
const {
  createOrUpdateHealthRecord,
  getHealthRecord
} = require("../controllers/healthController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/health-record",verifyToken, createOrUpdateHealthRecord);
router.get("/health-record", verifyToken, getHealthRecord);
module.exports = router;
