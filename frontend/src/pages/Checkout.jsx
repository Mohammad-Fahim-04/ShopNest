import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = totalPrice - discountAmount;

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderAmount: totalPrice })
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        setCouponError('');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = async () => {
    try {
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        // Razorpay unconfigured exception handler
        const fallback = window.confirm("Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?");
        if (fallback) {
          return bypassPayment();
        } else {
          return alert("Payment failed to initialize");
        }
      }

      const options = {
        key: 'rzp_test_dummykey123', // Student dummy fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          if (verifyRes.ok) {
            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: cartItems,
                originalAmount: totalPrice,
                discountAmount: discountAmount,
                couponCode: appliedCoupon?.code || null,
                totalAmount: finalAmount,
                address,
                paymentId: response.razorpay_payment_id
              })
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              alert('Order saving failed');
            }
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#f97316'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        originalAmount: totalPrice,
        discountAmount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        totalAmount: finalAmount,
        address,
        paymentId: 'bypass_txn_' + Date.now()
      })
    });
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    bypassPayment();
  };

  return (
    <div className="checkout-wrapper">
      {/* HEADER SECTION */}
      <div className="checkout-header">
        <div className="checkout-header-content">
          <span className="checkout-label">/ Secure Checkout</span>
          <h1 className="checkout-title">CHECKOUT</h1>
          <p className="checkout-subtitle">Complete your purchase securely</p>
        </div>
      </div>

      {/* MAIN CHECKOUT SECTION */}
      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-layout">
          
          {/* LEFT COLUMN - SHIPPING FORM */}
          <div className="checkout-form">
            <div className="form-section">
              <h2 className="form-title">Shipping Address</h2>
              
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  value={address.fullName} 
                  onChange={(e) => setAddress({...address, fullName: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Street Address" 
                  required 
                  value={address.street} 
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="City" 
                    required 
                    value={address.city} 
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Postal Code" 
                    required 
                    value={address.postalCode} 
                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Country" 
                  required 
                  value={address.country} 
                  onChange={(e) => setAddress({...address, country: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <div className="order-summary-box">
            <h2 className="summary-title">Order Summary</h2>

            {/* COUPON SECTION */}
            <div className="coupon-section-checkout">
              <h3 className="coupon-heading">Apply Coupon</h3>
              <div className="coupon-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={appliedCoupon !== null}
                  className="coupon-input-checkout"
                />
                {appliedCoupon ? (
                  <button 
                    type="button" 
                    className="coupon-btn-remove"
                    onClick={removeCoupon}
                  >
                    REMOVE
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="coupon-btn-apply"
                    onClick={validateCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? 'Validating...' : 'APPLY'}
                  </button>
                )}
              </div>
              {couponError && <p className="coupon-error-message">{couponError}</p>}
              {appliedCoupon && (
                <p className="coupon-success-message">
                  ✓ Coupon applied! Discount: ₹{appliedCoupon.discountAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* SUMMARY BREAKDOWN */}
            <div className="summary-breakdown">
              <div className="summary-line">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span className="summary-label">Shipping</span>
                <span className="summary-value free">FREE</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-line discount-line">
                  <span className="summary-label">Discount</span>
                  <span className="summary-value discount-value">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-line total-line">
                <span className="summary-label">Total</span>
                <span className="summary-value total-value">₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* PAYMENT BUTTON */}
            <button type="submit" className="checkout-btn">
              PAY ₹{finalAmount.toFixed(2)}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;