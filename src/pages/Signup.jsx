import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlesignup = async (e) => {
    e.preventDefault();
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    navigate("/dashboard");
  };

  const handleGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryBg px-4">
      <div className="bg-cardBg p-6 sm:p-8 rounded-xl2 shadow-xl w-full max-w-md">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-textWhite mb-2">
          AI Powered Finance Tracker
        </h1>
        <h2 className="text-lg text-softGray text-center mb-6">
          Create your account
        </h2>

        <form onSubmit={handlesignup} className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full bg-cardBgSoft border border-gray-700 px-3 py-3 rounded-xl text-textWhite placeholder-softGray focus:outline-none focus:ring-2 focus:ring-accentGreen"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-cardBgSoft border border-gray-700 px-3 py-3 rounded-xl text-textWhite placeholder-softGray focus:outline-none focus:ring-2 focus:ring-accentGreen"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-cardBgSoft border border-gray-700 px-3 py-3 rounded-xl text-textWhite placeholder-softGray focus:outline-none focus:ring-2 focus:ring-accentGreen"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-accentGreen text-black py-3 rounded-xl font-semibold hover:bg-accentGreenDark transition">
            Register
          </button>
        </form>

        <div className="my-4 text-center text-sm text-softGray">or</div>

        <button
          onClick={handleGoogle}
          className="w-full border border-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 bg-cardBgSoft hover:bg-cardBg transition text-textWhite"
        >
          <span className="text-red-500 font-bold text-lg">G</span>
          <span>Sign up with Google</span>
        </button>

        <p className="text-sm text-center mt-5 text-softGray">
          Have an account?{" "}
          <Link
            className="text-accentGreen font-medium hover:underline"
            to="/"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
