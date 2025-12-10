import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <div className="toast">{message}</div>}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
