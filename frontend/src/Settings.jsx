import { useState, useEffect } from "react";
import { authStore } from "./store/authStore";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const {
    user,
    loadUser,
    token,
    loadToken,
    profilepic,
    loadprofilepic,
    theme,
    logout,
    loadTheme,
    setTheme,
  } = authStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    loadUser();
    loadToken();
    loadprofilepic();
    loadTheme();
  }, [loadUser, loadToken, loadprofilepic, loadTheme]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading user details...
      </div>
    );
  }
  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("http://localhost:5000/auth/updatepic", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    authStore.getState().setUser(data.user);
    localStorage.setItem("profilepic", data.user.profilePic);
    loadprofilepic();
    toast.success("Profile Pic uploaded!");
  };
  const userUpdate = async () => {
    try {
      if (password.length === 0 && email.length === 0) {
        toast.error("please type details to update!");
        return;
      }
      const response = await fetch("http://localhost:5000/auth/update", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("updation failed!");
        console.error("Update failed:", data.message);
      } else {
        toast.success("password updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    }
  };

  return (
    <div className="m-8  sm:flex justify-around flex-wrap">
      <div className="sm:w-1/2 mt-2 ">
        <fieldset className="fieldset gap-2">
          <label className="text-sm font-bold">Username</label>
          <input
            type="text"
            className="input w-full sm:w-3/4"
            placeholder={user.username}
            value={user.username}
            disabled
          />

          <label className="text-sm font-bold">Email</label>
          <input
            type="email"
            className="input validator w-full sm:w-3/4"
            required
            placeholder={user.email || "Enter new email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="validator-hint">Enter valid email address</div>

          <label className="text-sm font-bold">Password</label>
          <label className="input validator w-full sm:w-3/4">
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
              placeholder="Enter your New Password"
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
        </fieldset>

        <button
          className="btn btn-outline mt-4 mb-8 sm:mb-0 px-12 w-full sm:w-fit"
          onClick={userUpdate}
        >
          Update
        </button>
      </div>
      <div className="w-full sm:w-1/2 ">
        <div className="text-sm font-bold text-center p-2">
          Choose your Theme{" "}
        </div>
        <div className="join join-vertical w-full gap-4">
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Default"
            value="default"
            checked={theme === "default"}
            onChange={(e) => setTheme(e.target.value)}
          />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Retro"
            value="retro"
            checked={theme === "retro"}
            onChange={(e) => setTheme(e.target.value)}
          />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Cyberpunk"
            value="cyberpunk"
            checked={theme === "cyberpunk"}
            onChange={(e) => setTheme(e.target.value)}
          />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Valentine"
            value="valentine"
            checked={theme === "valentine"}
            onChange={(e) => setTheme(e.target.value)}
          />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="dark"
            value="dark"
            checked={theme === "dark"}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
      </div>
      <div className=" w-full flex p-8 justify-between">
        <div className="avatar border rounded-full m-2 hidden sm:flex">
          <div className="w-20 rounded-full m-2">
            <img alt="profilepic" src={`http://localhost:5000${profilepic}`} />
          </div>
        </div>
        <input
          type="file"
          className="border border-dashed rounded-xl  cursor-pointer w-1/2 sm:w-full text-sm p-2 sm:p-6"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload} className="btn btn-dashed ">
          Upload
        </button>
      </div>
      <button
        className="btn btn-error w-full text-white mb-10 sm:hidden"
        onClick={handleLogout}
      >
        Logout
      </button>
      <Toaster
        toastOptions={{
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
