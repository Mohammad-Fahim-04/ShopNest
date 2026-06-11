const Order = require("../models/Order");
const Product = require("../models/Products");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: "user" });

    const orders = await Order.find({});

    const totalRevenue = orders.reduce(
      (acc, item) => acc + (item.totalAmount || item.totalPrice || 0),
      0
    );

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: { $ifNull: ["$totalAmount", "$totalPrice"] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    console.log(monthlySales);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };