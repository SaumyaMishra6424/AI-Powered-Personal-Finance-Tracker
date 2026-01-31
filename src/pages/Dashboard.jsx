import { useState, useMemo } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const COLORS = ["#8B5CF6", "#22C55E", "#F43F5E", "#F59E0B"];

const incomeCategories = ["Salary","Freelance","Investment","Business","Bonus"];
const expenseCategories = ["Food","Shopping","Medical","Travel","Bills","Entertainment","Education","Transport"];

export default function Dashboard() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const { user } = useAuth();
const shortId = user?.uid ? user.uid.slice(0, 8).toUpperCase() : "";

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    type: "Income",
    category: "Salary",
    note: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const summary = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach(t =>
      t.type === "Income" ? income += +t.amount : expense += +t.amount
    );
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "Expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + +t.amount;
    });
    return Object.keys(map).map(k => ({ name: k, value: map[k] }));
  }, [transactions]);

  const monthlyChartData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "Expense").forEach(t => {
      const d = new Date(t.date);
      const key = format(d, "yyyy-MM");
      map[key] = (map[key] || 0) + Number(t.amount);
    });

    return Object.entries(map)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [transactions]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      amount: "",
      type: "Income",
      category: "Salary",
      note: "",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ ...t });
    setOpen(true);
  };

  const saveTransaction = () => {
    if (editing) updateTransaction(editing.id, form);
    else addTransaction(form);
    setOpen(false);
  };

  const categories = form.type === "Income" ? incomeCategories : expenseCategories;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-100 px-4 py-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hi, 👋 {user?.displayName}
          </h1>

          <Link to="/profile">
            <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">
              Profile
            </button>
          </Link>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card title="Current Balance" value={`₹${summary.balance}`} big />

          <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white p-5 rounded-xl shadow">
            <Link to="/ai">
              <button className="w-full sm:w-auto bg-white/90 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-white transition">
                Detailed Insights
              </button>
            </Link>
            <p className="text-sm mt-2 opacity-90">
              Add more transactions to get insights
            </p>
          </div>

          <Card title="Your User ID" value={shortId} />

        </div>

        {/* Pie Chart */}
        <div className="bg-[#111827] p-4 rounded-xl mb-6 border border-gray-800">
          <h3 className="font-semibold mb-2 text-center sm:text-left">
            Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                labelStyle={{ color: "#E5E7EB" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Line Chart */}
        <div className="bg-[#111827] p-4 rounded-xl mb-6 border border-gray-800">
          <h3 className="font-semibold mb-2 text-center sm:text-left">
            Monthly Spending Trend
          </h3>

          {monthlyChartData.length === 0 ? (
            <p className="text-gray-400 text-center">
              No monthly spending data to display yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  tickFormatter={(m) => format(new Date(m + "-01"), "MMM yy")}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                  formatter={(value) => `₹${value}`}
                  labelFormatter={(m) =>
                    format(new Date(m + "-01"), "MMMM yyyy")
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Expenses"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Transactions list */}
        <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-3">Recent Transactions</h3>

          {transactions.map(t => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800 py-2 gap-2"
            >
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-sm text-gray-400">{t.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={t.type === "Income" ? "text-emerald-400" : "text-rose-400"}>
                  {t.type === "Income" ? "+" : "-"}₹{t.amount}
                </span>
                <button onClick={() => openEdit(t)} className="hover:text-indigo-400">✏️</button>
                <button onClick={() => deleteTransaction(t.id)} className="hover:text-rose-400">🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={openAdd}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-3xl font-bold shadow-lg transition"
        >
          +
        </button>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center px-4">
            <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">
                {editing ? "Edit" : "Add"} Transaction
              </h2>

              <input
                className="w-full bg-[#0B0F1A] border border-gray-700 p-3 mb-2 rounded text-white"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />

              <select
                className="w-full bg-[#0B0F1A] border border-gray-700 p-3 mb-2 rounded text-white"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value, category: "" })}
              >
                <option>Income</option>
                <option>Expense</option>
              </select>

              <select
                className="w-full bg-[#0B0F1A] border border-gray-700 p-3 mb-2 rounded text-white"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>

              <input
                type="date"
                className="w-full bg-[#0B0F1A] border border-gray-700 p-3 mb-4 rounded text-white"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />

              <button
                onClick={saveTransaction}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition"
              >
                Save Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Card = ({ title, value, big }) => (
  <div className="bg-[#111827] p-5 rounded-xl border border-gray-800 shadow">
    <p className="text-gray-400 text-sm">{title}</p>
    <h3 className={`${big ? "text-2xl sm:text-4xl" : "text-lg"} font-bold mt-2 break-all text-white`}>
      {value}
    </h3>
  </div>
);
