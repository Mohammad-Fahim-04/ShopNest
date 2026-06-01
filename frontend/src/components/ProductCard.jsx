import React from "react";
import { Link } from "react-router-dom";
import "../styles/product.css";

const ProductCard = ({ product, index = 0 }) => {
  const num = String(index + 1).padStart(2, "0");
  return (
    <Link to={`/products/${product._id}`} className="editorial-card">
      <div className="editorial-img-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.opacity = 0.3; }}
        />
        <span className="card-index">N° {num}</span>
      </div>
      <div className="editorial-card-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.category || "Premium Wear"}</p>
        </div>
        <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
      </div>
    </Link>
  );
};

export default ProductCard;
