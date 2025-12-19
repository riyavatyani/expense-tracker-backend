const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIInsights = async (req, res) => {
  try {
    const { totalIncome, totalExpenses, categorySummary } = req.body;

    // prevent empty calls
    if (!totalIncome && !totalExpenses) {
      return res.json({
        insights: "Add some income or expenses to get AI insights.",
      });
    }

    const prompt = `
You are a personal finance assistant.
Give 3 short bullet-point insights.

Income: ₹${totalIncome}
Expenses: ₹${totalExpenses}
Expense data: ${JSON.stringify(categorySummary)}

Keep it short, friendly and useful.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    res.json({
      insights: response.output_text || "No insights generated.",
    });

  } catch (error) {
    console.error("AI ERROR 👉", error.message);

    res.json({
      insights:
        "AI is temporarily unavailable. Please try again in a few moments.",
    });
  }
};
