import { createContext, useState } from "react";

export let authContext = createContext("");
export default function AuthContext({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  return (
    <>
      <authContext.Provider value={{ setToken, token, userId, setUserId }}>
        {children}
      </authContext.Provider>
    </>
  );
}
