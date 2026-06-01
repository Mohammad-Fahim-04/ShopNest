import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--line)',
    padding: '50px 40px 30px',
    marginTop: '80px',
    background: 'var(--bg)',
  }}>
    <div style={{
      maxWidth: '1800px', margin: '0 auto',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px'
    }}>
      <div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--cream)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
          ShopNest®
        </h3>
        <p className="label" style={{ marginTop: '10px' }}>Wear the silence.</p>
      </div>
      <div>
        <p className="label" style={{ marginBottom: '14px', color: 'var(--cream)' }}>Shop</p>
        <Link to="/shop" className="label" style={{ display: 'block', marginBottom: '8px' }}>All Products</Link>
        <Link to="/cart" className="label" style={{ display: 'block' }}>Bag</Link>
      </div>
      <div>
        <p className="label" style={{ marginBottom: '14px', color: 'var(--cream)' }}>Info</p>
        <Link to="/about" className="label" style={{ display: 'block', marginBottom: '8px' }}>About</Link>
        <Link to="/return" className="label" style={{ display: 'block', marginBottom: '8px' }}>Returns</Link>
        <Link to="/disclaimer" className="label" style={{ display: 'block' }}>Disclaimer</Link>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p className="label">© {new Date().getFullYear()}</p>
        <p className="label" style={{ marginTop: '8px' }}>Made with intent.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
