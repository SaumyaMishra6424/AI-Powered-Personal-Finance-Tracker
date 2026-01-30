import { useState } from "react";

export default function AIInsights() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();

      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer("No response from AI.");
      }
    } catch (err) {
      console.error(err);
      setAnswer("Error connecting to AI service");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-100 px-4 py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          AI Insights
        </h1>

        <textarea
          className="w-full bg-[#111827] border border-gray-800 rounded-xl p-3 mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
          placeholder="Ask about your income, expenses, savings tips..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {answer && (
          <div className="mt-5 bg-[#111827] border border-gray-800 p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">AI Response</h2>
            <p className="whitespace-pre-line text-sm sm:text-base text-gray-200">
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
