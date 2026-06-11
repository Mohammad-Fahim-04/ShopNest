import React from "react";
import "../styles/product.css";
import { usePageTransition } from "../components/PageTransition";

const ProductCard = ({ product }) => {
  const { startTransition } = usePageTransition();

  const handleProductClick = () => {
    startTransition(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className={`editorial-card ${product.featured ? "featured-card" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div className="editorial-img-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.opacity = 0.3;
          }}
        />
      </div>

      <div className="editorial-card-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.category || "Premium Wear"}</p>
        </div>

        <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
      </div>
    </div>
  );
};

export default ProductCard;