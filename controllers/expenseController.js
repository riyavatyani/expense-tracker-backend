const Expense = require("../models/Expense");
const xlsx = require("xlsx");

/* ================================
   ➕ ADD EXPENSE (FIXED DATE ISSUE)
================================ */
exports.addExpense = async (req, res) => {
  try {
    const { category, amount, date, icon } = req.body;

    // ✅ correct validation
    if (!category || !amount || !date) {
      return res.status(400).json({
        message: "Category, amount and date are required",
      });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      category,
      amount,
      date: new Date(date), // ✅ frontend selected date
      icon: icon || "",     // ✅ optional
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR 👉", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   📄 GET ALL EXPENSE
================================ */
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("GET ALL EXPENSE ERROR 👉", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   📊 LAST 30 DAYS EXPENSE (FIXED)
================================ */
exports.getLast30DaysExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    const transactions = await Expense.find({
      userId,
      date: { $gte: last30Days },
    }).sort({ date: -1 });

    const total = transactions.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      total,
      transactions,
    });
  } catch (error) {
    console.error("LAST 30 DAYS EXPENSE ERROR 👉", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   ❌ DELETE EXPENSE
================================ */
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   📥 DOWNLOAD EXPENSE EXCEL
================================ */
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString("en-IN"),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    const filePath = "expense_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
