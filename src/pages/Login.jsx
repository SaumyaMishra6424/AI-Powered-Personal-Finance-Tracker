import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryBg px-4">
      <div className="bg-cardBg p-6 sm:p-8 rounded-xl2 shadow-xl w-full max-w-md">

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-textWhite mb-2">
          AI Powered Finance Tracker
        </h1>
        <h2 className="text-lg text-softGray text-center mb-6">
          Log in to your account
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            disabled={loading}
            className="w-full bg-accentGreen text-black py-3 rounded-xl font-semibold hover:bg-accentGreenDark transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-4 text-center text-sm text-softGray">or</div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 bg-cardBgSoft hover:bg-cardBg transition text-textWhite disabled:opacity-60"
        >
          <span className="text-red-500 font-bold text-lg">G</span>
          <span>{loading ? "Please wait..." : "Sign in with Google"}</span>
        </button>

        <p className="text-sm text-center mt-5 text-softGray">
          Don’t have an account?{" "}
          <Link
            className="text-accentGreen font-medium hover:underline"
            to="/signup"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
