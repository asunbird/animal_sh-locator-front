import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";

const SignOut = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(() => {
    logout(false);
    setToken(null);
    navigate("/", { replace: true });
  }, [navigate, setToken]);

  useEffect(() => {
    const timer = setTimeout(handleSignOut, 3000);
    return () => clearTimeout(timer);
  }, [handleSignOut]);

  return (
    <>
      <p>Signing out…</p>
      <button onClick={handleSignOut}>Sign Out Now</button>
    </>
  );
};

export default SignOut;