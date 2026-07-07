import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { getApiUrl } from "../utils/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(getApiUrl("/api/products"));

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        setProducts(data.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="home-container">

      {/* HERO */}
      <section className="hero-banner">

        <h1 className="hero-title page-brand-reveal">
          {"SHOPNEST".split("").map((letter, index) => (
            <span
              key={index}
              className="hero-letter reveal-letter"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <div className="hero-meta">

          <span className="label">
            / COLLECTION 26
          </span>

          <p>
            Wear the silence. Minimal streetwear pieces
            built for clean silhouettes, raw attitude,
            and everyday confidence.
          </p>

          <Link to="/shop" className="btn">
            Enter Shop →
          </Link>

          <span className="copy">
            © {new Date().getFullYear()} SHOPNEST®
          </span>

        </div>

      </section>

      {/* PROMOTIONAL STRIP */}
      <section className="promo-strip coupon-strip">
        <div className="promo-content">
          <p className="promo-text">
            SAVE10 • 10% OFF YOUR FIRST ORDER • FREE SHIPPING OVER ₹999
          </p>
          <Link to="/shop" className="promo-link">
            Shop Now →
          </Link>
        </div>
      </section>

      {/* DROPS */}
      <section className="drops-section">

        <div className="drops-header">
          <h2>Selected / Drops</h2>
        </div>

        {loading ? (
          <p className="label">Loading…</p>
        ) : (
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  );
};

export default Home;