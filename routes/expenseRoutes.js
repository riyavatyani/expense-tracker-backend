const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  addExpense,
  getAllExpense,
  getLast30DaysExpenses,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");

// ➕ add expense
router.post("/add", protect, addExpense);

// 📄 get all expense
router.get("/", protect, getAllExpense);

// 📊 last 30 days expense
router.get("/last30days", protect, getLast30DaysExpenses);

// ❌ delete expense
router.delete("/:id", protect, deleteExpense);

// 📥 download excel ✅ (MATCH FRONTEND)
router.get("/download", protect, downloadExpenseExcel);

module.exports = router;
