import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      createdAt: new Date(),
    });
  }
};
