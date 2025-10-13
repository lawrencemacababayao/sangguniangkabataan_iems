import React, { useState, useEffect } from 'react';
import bgImage from "../assets/ChatGPT Image Oct 11, 2025, 02_38_22 PM.png";
import logoImage from "../assets/skkkk.png";
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import "../media/login.css"
const YouthLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupClick = () => {
    navigate("/youthsignup");
  };

  useEffect(() => {
    document.title = "Login | Sangguniang Kabataan";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Log in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Check if email is verified
      if (!user.emailVerified) {
        alert("Please verify your email first before logging in.");
        setLoading(false);
        return;
      }

      // 3️⃣ Move from 'pending' → 'official_youth' if exists
      const pendingRef = doc(db, "pending", user.uid);
      const pendingSnap = await getDoc(pendingRef);

      if (pendingSnap.exists()) {
        const data = pendingSnap.data();

        // Copy data to official_youth collection
        await setDoc(doc(db, "official_youth", user.uid), {
          ...data,
          verified: true,
          verifiedAt: new Date(),
        });

        // Delete from pending
        await deleteDoc(pendingRef);
      }

      navigate("/youthhomepage"); // replace with your youth dashboard/home route

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-top flex flex-col items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <div className="container w-full h-1/6 mt-5 flex justify-center items-center">
        <img src={logoImage} alt="SK Logo" className="w-30 object-cover mr-3" />
        <h1 className="text1 text-white/80 text-5xl mr-3">SANGGUNIANG</h1>
        <h1 className="text2 text-white/80 font-bold text-5xl">KABATAAN</h1>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-[#F3F1FF]/70 pt-5 rounded-2xl shadow-xl w-full max-w-md h-3/5 flex flex-col items-center mt-10"
      >
        <h1 className="text-4xl font-bold text-[#3489FF] mt-7">LOGIN</h1>
        <div className="w-full h-full p-15 pt-8 px-8">
          <label htmlFor="email" className="font-medium ml-3">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-5 h-10 mb-5 rounded-3xl"
            required
          />

          <label htmlFor="password" className="font-medium ml-3">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-5 h-10 mb-10 rounded-3xl"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3489FF] w-full h-10 rounded-3xl cursor-pointer text-xl text-white hover:bg-[#2872d1] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-5">
            Don’t have an account?{" "}
            <span
              onClick={handleSignupClick}
              className="underline underline-offset-6 cursor-pointer text-[#3489FF]"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default YouthLogin;
