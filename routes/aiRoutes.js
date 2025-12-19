const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getAIInsights } = require("../controllers/aiController");

router.post("/insights", protect, getAIInsights);

module.exports = router;
