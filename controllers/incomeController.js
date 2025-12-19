// const User = require("../models/user");
const Income = require("../models/Income");
const xlsx = require("xlsx");

/* ================================
   ➕ ADD INCOME (FIXED DATE ISSUE)
================================ */
exports.addIncome = async (req, res) => {
  try {
    const { source, amount, date } = req.body;

    if (!source || !amount) {
      return res
        .status(400)
        .json({ message: "Source and amount are required" });
    }

    const income = await Income.create({
      userId: req.user._id,
      source,
      amount,
      date: date ? new Date(date) : new Date(), // ✅ FIX
    });

    return res.status(201).json(income);
  } catch (error) {
    console.error("ADD INCOME ERROR 👉", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   📄 GET ALL INCOME
================================ */
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   📊 LAST 60 DAYS INCOME (FIXED)
================================ */
exports.getLast60DaysIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last60Days = new Date(today);
    last60Days.setDate(today.getDate() - 60);

    const transactions = await Income.find({
      userId,
      date: { $gte: last60Days },
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
    console.error("LAST 60 DAYS INCOME ERROR 👉", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   ❌ DELETE INCOME
================================ */
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   📥 DOWNLOAD EXCEL
================================ */
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString("en-IN"),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(wb, ws, "Income");
    const filePath = "income_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
