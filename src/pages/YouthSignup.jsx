import bgImage from "../assets/ChatGPT Image Oct 11, 2025, 02_38_22 PM.png";
import logoImage from "../assets/skkkk.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const YouthSignup = () => {
  const navigate = useNavigate();

  // ✅ States
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    barangay: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [barangays, setBarangays] = useState([]);

 useEffect(() => { 
    async function loadBarangays() { 
        try { const res = await fetch("https://psgc.gitlab.io/api/barangays/");
             const data = await res.json();
              const misOrBarangays = data 
              .filter((b) => b.provinceCode === "104300000") 
              .sort((a, b) => a.name.localeCompare(b.name)); 
              setBarangays(misOrBarangays); 
            } catch (error) {
                 console.error("Error loading barangays:", error);
                 } 
                } 
                loadBarangays(); 
            }, []);

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ✅ Go to login
  const handleLoginClick = () => {
    navigate("/youthlogin");
  };

  // ✅ Signup logic
  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2️⃣ Send verification email
      await sendEmailVerification(user);

      // 3️⃣ Save data to "pending" collection
      await setDoc(doc(db, "pending", user.uid), {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        barangay: formData.barangay,
        gender: formData.gender,
        email: formData.email,
        verified: false,
        createdAt: new Date(),
      });

      setVerificationSent(true);
      navigate("/youthresendverification");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Sign Up | Sangguniang Kabataan";
  }, []);

  return (
    <div
      className="relative w-screen min-h-screen bg-cover bg-top flex flex-col items-center p-5"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <div className="w-full flex justify-center items-center">
        <img src={logoImage} alt="SK Logo" className="w-32 object-cover mr-3" />
        <div className="text-white/80 text-center flex gap-5">
          <h1 className="text-4xl sm:text-5xl font-light">SANGGUNIANG</h1>
          <h1 className="text-4xl sm:text-5xl font-bold">KABATAAN</h1>
        </div>
      </div>

      {/* Signup Form */}
      <form
        onSubmit={handleSignup}
        className="bg-[#F3F1FF]/70 rounded-2xl shadow-xl w-full max-w-3xl p-6 sm:p-10 flex flex-col items-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3489FF] mb-5">
          SIGN UP
        </h1>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left column */}
          <div>
            <label className="font-medium ml-2">Firstname</label>
            <input
              id="firstname"
              type="text"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl"
              required
            />

            <label className="font-medium ml-2">Lastname</label>
            <input
              id="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl"
              required
            />

            <label className="font-medium ml-2">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl"
              required
            />

            <label className="font-medium ml-2">Select Barangay</label>
            <select
              id="barangay"
              value={formData.barangay}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMzQ4OUZGIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSI2Ij48cGF0aCBkPSJNNSA2TDAtMEgxMEw1IDZaIi8+PC9zdmc+')] bg-no-repeat bg-[right_1.5rem_center]"
            >
              <option value="">Select Barangay</option>
              {barangays.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right column */}
          <div>
            <label className="font-medium ml-2">Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMzQ4OUZGIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSI2Ij48cGF0aCBkPSJNNSA2TDAtMEgxMEw1IDZaIi8+PC9zdmc+')] bg-no-repeat bg-[right_1.5rem_center]"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label className="font-medium ml-2">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl"
              required
            />

            <label className="font-medium ml-2">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl"
              required
            />

            <label className="font-medium ml-2">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/50 border-[#3489FF] border-2 outline-none px-4 h-10 mb-3 rounded-3xl"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#3489FF] w-full max-w-sm mt-6 h-10 rounded-3xl text-xl text-white hover:bg-[#2872d1] transition"
        >
          {loading ? "Creating Account..." : "Sign up"}
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={handleLoginClick}
            className="underline underline-offset-4 cursor-pointer text-[#3489FF]"
          >
            Login
          </span>
        </p>
      </form>

      {/* Popup for verification */}
      {verificationSent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center shadow-lg max-w-sm">
            <h2 className="text-2xl font-bold text-[#3489FF] mb-3">
              Verify your Email
            </h2>
            <p>
              A verification link was sent to <b>{formData.email}</b>. Please
              check your inbox.
            </p>
            <button
              onClick={handleLoginClick}
              className="mt-4 bg-[#3489FF] text-white px-5 py-2 rounded-3xl hover:bg-[#2872d1] transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouthSignup;
