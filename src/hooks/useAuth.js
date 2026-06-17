import { useContext } from "react";
import { AuthContext } from "../provider/authContext";

// Custom hook to easily access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
