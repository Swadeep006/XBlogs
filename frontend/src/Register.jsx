import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userRegister = async () => {
    try {
      if (
        password.length === 0 ||
        email.length === 0 ||
        username.length === 0
      ) {
        toast.error("Enter all the details");
        return; 
      }

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      console.log(response.data);

      if (!response.ok) {
        console.log("Registration Failed", response.status);
        toast.error("Registration Failed");
        return;
      }

      toast.success("Registered Successfully, please login!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex justify-center m-8">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Register</legend>

          <label className="label text-sm font-bold">Username</label>
          <input
            type="text"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="text-sm font-bold">Email</label>
          <input
            type="email"
            className="input validator"
            required
            placeholder={"Enter email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="validator-hint">Enter valid email address</div>

          <label className="text-sm font-bold">Password</label>
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              placeholder="Enter your Password"
              minlength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters, including
            <br />
            At least one number <br />
            At least one lowercase letter <br />
            At least one uppercase letter
          </p>

          <button
            className="btn btn-neutral mt-4"
            onClick={() => {
              userRegister();
            }}
          >
            Register
          </button>
          <div className="flex justify-center m-2">
            Already have an account?
            <a href="/" className="ml-1 underline">
              Login
            </a>
          </div>
        </fieldset>
        <Toaster
          toastOptions={{
            duration: 3000,
            removeDelay: 1000,
          }}
        />
      </div>
    </>
  );
}
