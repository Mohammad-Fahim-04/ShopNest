const Coupon = require("../models/couponModel");

const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount should be ₹${coupon.minOrderAmount}`,
      });
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }

    const finalAmount = orderAmount - discountAmount;

    res.json({
      message: "Coupon applied successfully",
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Coupon validation failed" });
  }
};

module.exports = { validateCoupon };