import { createContext, useContext, useEffect, useState } from "react";
import { updateDoc } from "firebase/firestore";

import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setTransactions(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsub;
  }, [user]);

  const addTransaction = async (data) => {
  if (!user) return; // safety

  await addDoc(collection(db, "transactions"), {
    amount: Number(data.amount),
    type: data.type,
    category: data.category,
    note: data.note || "",
    date: data.date,
    uid: user.uid,           // VERY IMPORTANT
    createdAt: Date.now(),
  });
};

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
  };

  const updateTransaction = async (id, data) => {
  await updateDoc(doc(db, "transactions", id), {
    ...data,
    uid: user.uid,
  });
};


  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, deleteTransaction, updateTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
