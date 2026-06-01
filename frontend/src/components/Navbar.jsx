import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((s) => s.cart.cartItems);
  const totalQty = cartItems.reduce((n, i) => n + (i.qty || 1), 0);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          <img src="/ShopNestLogo.png" alt="ShopNest" className="brand-logo" />
          <span className="brand-text">SHOPNEST</span>
        </Link>
      </div>

      <nav className="navbar-right">
        <Link to="/shop" className={location.pathname === "/shop" ? "active-link" : ""}>SHOP</Link>
        <Link to="/cart" className={location.pathname === "/cart" ? "active-link" : ""}>BAG ({totalQty})</Link>

        {user ? (
          <>
            <Link to="/profile">PROFILE</Link>
            {user.role === "admin" && <Link to="/admin">ADMIN</Link>}
            <button onClick={handleLogout} className="logout-btn">LOGOUT</button>
          </>
        ) : (
          <Link to="/login">LOGIN</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;