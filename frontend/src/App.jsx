import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authStore } from "./store/authStore";

import Allblogs from "./Allblogs";
import Navbar from "./Components/Navbar";
import Postheader from "./Components/Postheader";
import EditorOriginal from "./Components/EditorOriginal";
import Profile from "./Profile";
import Blog from "./Blog";
import EditBlog from "./EditBlog";
import Login from "./Login";
import Register from "./Register";
import Settings from "./Settings";
import Mobilenav from "./Components/Mobilenav";

function App() {
  const { user, loadprofilepic, loadTheme } = authStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const hideLayout = ["/", "/register"].includes(location.pathname);

  const loadUser = authStore((state) => state.loadUser);

  useEffect(() => {
    (async () => {
      await loadUser();
      loadprofilepic();
      loadTheme();
      setIsUserLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (user === null && !hideLayout) {
      navigate("/");
    }
  }, [user, hideLayout, navigate, location.pathname, isUserLoaded]);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {!hideLayout && <Navbar />}
      {!hideLayout && <Mobilenav />}

      <div className="flex flex-col w-full">
        {!hideLayout && <Postheader />}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Allblogs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/blogs/:BlogId" element={<Blog />} />
            <Route path="/newblog" element={<EditorOriginal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
