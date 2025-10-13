import React, { useEffect, useState } from "react";
import bgImage from "../assets/ChatGPT Image Oct 11, 2025, 02_38_22 PM.png";
import logoImage from "../assets/skkkk.png";
import { auth, db } from "../config/firebase";
import { sendEmailVerification, onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";


const YouthVerificationResend = () => {
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // ✅ Detect and apply verification link directly
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const actionCode = params.get("oobCode");

  if (mode === "verifyEmail" && actionCode) {
    // Apply verification from Gmail link
    applyActionCode(auth, actionCode)
      .then(() => {
        alert("Email successfully verified!");
        navigate("/youthlogin");
      })
      .catch((error) => {
        console.error("Verification error:", error);
        alert("Verification link invalid or expired.");
      });
  }
}, [navigate]);


  // 🧠 Check verification status automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          try {
            // Move from pending → official_youth
            const pendingRef = doc(db, "pending", user.uid);
            const snap = await getDoc(pendingRef);

            if (snap.exists()) {
              const data = snap.data();
              await setDoc(doc(db, "official_youth", user.uid), {
                ...data,
                verified: true,
                verifiedAt: new Date(),
              });
              await deleteDoc(pendingRef);
            }

            alert("Your email has been verified successfully!");
            navigate("/youthlogin");
          } catch (error) {
            console.error("Error moving user:", error);
          }
        } else {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleResend = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("No user found. Please sign up again.");
      navigate("/youthsignup");
      return;
    }

    try {
      await sendEmailVerification(user);
      alert("Verification email resent! Please check your inbox.");
      setCooldown(30); // 30s cooldown
    } catch (error) {
      console.error("Error resending verification:", error);
      alert(error.message);
    }
  };

  // ⏳ Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (checking) {
    return (
      <div className="relative w-screen h-screen bg-cover bg-top flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="w-70 h-20 bg-white/70 flex justify-center p-5 items-center rounded-3xl">Checking Verification...</div>
      </div>
    );
  }

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-top flex flex-col items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full flex justify-center items-center mt-5">
        <img src={logoImage} alt="SK Logo" className="w-32 object-cover mr-3" />
        <div className="text-white/80 text-center flex gap-5">
          <h1 className="text-4xl sm:text-5xl font-light">SANGGUNIANG</h1>
          <h1 className="text-4xl sm:text-5xl font-bold">KABATAAN</h1>
        </div>
      </div>

      <form className="bg-[#F3F1FF]/70 rounded-2xl shadow-xl w-full max-w-md p-10 flex flex-col justify-center items-center text-center mt-20">
        <h1 className="text-3xl font-bold text-[#3489FF] mb-5">
          Verify your Email
        </h1>
        <p className="text-gray-700 mb-8">
          A verification link was sent to your registered email. Please check
          your inbox or click below to resend.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`w-40 p-3 rounded-xl text-xl font-medium text-white ${
            cooldown > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#3489FF] hover:bg-[#2872d1]"
          }`}
        >
          {cooldown > 0 ? `Wait ${cooldown}s` : "Resend"}
        </button>

        
      </form>
    </div>
  );
};

export default YouthVerificationResend;
