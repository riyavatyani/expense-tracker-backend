require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

console.log("JWT_SECRET ", process.env.JWT_SECRET);
console.log("OPENAI KEY LOADED ", !!process.env.OPENAI_API_KEY);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-frontend-six-brown.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ✅ Body parser
app.use(express.json());

// ✅ DB
connectDB();

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/ai", aiRoutes);


// ✅ Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ PORT (KEEP THIS CONSISTENT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
