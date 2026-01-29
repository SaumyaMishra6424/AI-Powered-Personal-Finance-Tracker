import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";

export default function TransactionModal({ close }) {
  const { addTransaction } = useTransactions();
  const [form, setForm] = useState({
    amount: "",
    type: "Expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const submit = () => {
    addTransaction(form);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-bold mb-4">Add New Transaction</h2>

        <input className="input" placeholder="Amount"
          onChange={e => setForm({ ...form, amount: e.target.value })} />

        <select className="input"
          onChange={e => setForm({ ...form, type: e.target.value })}>
          <option>Expense</option>
          <option>Income</option>
        </select>

        <input className="input" placeholder="Category"
          onChange={e => setForm({ ...form, category: e.target.value })} />

        <input type="date" className="input"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })} />

        <button onClick={submit} className="btn w-full mt-3">
          Save Transaction
        </button>
      </div>
    </div>
  );
}
