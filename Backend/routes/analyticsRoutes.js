const express = require("express");
const router = express.Router();

const { getAdminStats } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/summary", protect, admin, getAdminStats);

module.exports = router;