import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { usePageTransition } from "./PageTransition";
import ThemeSwitcher from "./ThemeSwitcher";
import { FiShoppingBag, FiShoppingCart, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { startTransition } = usePageTransition();

  const cartItems = useSelector((s) => s.cart.cartItems);
  const totalQty = cartItems.reduce((n, i) => n + (i.qty || 1), 0);
  const location = useLocation();

  const goToPage = (path) => {
    startTransition(path);
  };

  const handleLogout = () => {
    logout();
    startTransition("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button onClick={() => goToPage("/")} className="brand nav-transition-btn">
          <img src="/ShopNestLogo.png" alt="ShopNest" className="brand-logo" />
          <span className="brand-text">SHOPNEST</span>
        </button>
      </div>

      <nav className="navbar-right">
        <button
          onClick={() => goToPage("/shop")}
          className={`nav-transition-btn ${location.pathname === "/shop" ? "active-link" : ""}`}
        >
          <FiShoppingBag className="nav-icon" />
          <span>SHOP</span>
        </button>

        <button
          onClick={() => goToPage("/cart")}
          className={`nav-transition-btn ${location.pathname === "/cart" ? "active-link" : ""}`}
        >
          <FiShoppingCart className="nav-icon" />
          <span>BAG ({totalQty})</span>
        </button>

        {user ? (
          <>
            <button onClick={() => goToPage("/profile")} className="nav-transition-btn">
              <FiUser className="nav-icon" />
              <span>PROFILE</span>
            </button>

            {user.role === "admin" && (
              <button onClick={() => goToPage("/admin")} className="nav-transition-btn">
                <FiGrid className="nav-icon" />
                <span>ADMIN</span>
              </button>
            )}

            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut className="nav-icon" />
              <span>LOGOUT</span>
            </button>
          </>
        ) : (
          <button onClick={() => goToPage("/login")} className="nav-transition-btn">
            <FiUser className="nav-icon" />
            <span>LOGIN</span>
          </button>
        )}

        <ThemeSwitcher />
      </nav>
    </header>
  );
};

export default Navbar;