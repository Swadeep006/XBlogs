import { CircleUser, UserCog, House } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Mobilenav() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full p-4 rounded-t-2xl glass shadow bottom-0 fixed flex justify-around z-10 sm:hidden">
        <UserCog onClick={() => navigate("/settings")} />
        <House onClick={() => navigate("/home")} />
        <CircleUser onClick={() => navigate("/profile")} />
      </div>
    </>
  );
}
