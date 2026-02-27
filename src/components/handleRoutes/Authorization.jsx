import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Authorization({ children }) {
  const { token } = useContext(authContext);

  if (token) {
    return <Navigate to={"/"} />;
  }
  return <> {children} </>;
}
