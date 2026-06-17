import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignOut = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const timer = setTimeout(handleSignOut, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <p>Signing out…</p>
      <button onClick={handleSignOut}>Sign Out Now</button>
    </>
  );
};

export default SignOut;