import React, { createContext, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/product.css";

const TransitionContext = createContext();

export const usePageTransition = () => useContext(TransitionContext);

export const PageTransitionProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const startTransition = (path) => {
    if (location.pathname === path) return;

    setShow(true);

   setTimeout(() => {
  navigate(path);
}, 750);

setTimeout(() => {
  setShow(false);
}, 1750);
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}

      {show && (
        <div className="global-page-transition">
          <h1>SHOPNEST</h1>
        </div>
      )}
    </TransitionContext.Provider>
  );
};