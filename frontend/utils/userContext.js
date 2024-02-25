import { createContext, useContext, useState } from "react";

const userContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  return (
    <userContext.Provider value={{ user, setUser, cart, setCart }}>
      {children}
    </userContext.Provider>
  );
}
export function useUserContext() {
  return useContext(userContext);
}
