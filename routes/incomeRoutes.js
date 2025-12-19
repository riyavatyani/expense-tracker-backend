const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);

// ✅ CHANGE THIS
router.get("/download", protect, downloadIncomeExcel);

router.delete("/:id", protect, deleteIncome);

module.exports = router;
