import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignOut  = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    setToken();
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleSignout();
  }, 3 * 1000);

  return <>SignOut Page
    <button>Sign Out</button>
  </>;
};

export default SignOut;