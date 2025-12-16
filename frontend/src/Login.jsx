import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "./store/authStore";

export default function Login() {
  const setUser = authStore((state) => state.setUser);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.message);
        alert(data.message || "Invalid credentials");
        return;
      }

      if (!data.user || !data.token) {
        console.error("Invalid response:", data);
        alert("Something went wrong with login response");
        return;
      }

      authStore.getState().setUser(data.user);
      authStore.getState().setToken(data.token);
      localStorage.setItem("auth_token", data.token);

      setUser({
        username: data.user.username,
        email: data.user.email,
        token: data.token,
      });

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div  className=" hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Left side text */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Access your account and manage everything seamlessly — quick,
            secure, and reliable.
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                userLogin();
              }}
            >
              <fieldset className="fieldset">
                <label className="label">Username / Email</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />

                {/* <label className="label mt-2">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                /> */}

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
                      <circle
                        cx="16.5"
                        cy="7.5"
                        r=".5"
                        fill="currentColor"
                      ></circle>
                    </g>
                  </svg>
                  <input
                    type="password"
                    required
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

                <div className="flex justify-between mt-2 text-sm">
                  <a href="#" className="link link-hover">
                    Forgot password?
                  </a>
                  <a href="/register" className="link link-hover">
                    Create account
                  </a>
                </div>

                <button type="submit" className="btn btn-neutral mt-4 w-full">
                  Login
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
