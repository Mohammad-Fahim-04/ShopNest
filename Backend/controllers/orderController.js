const Order = require('../models/Order');
const Product = require('../models/Products');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const PDFDocument = require('pdfkit');

const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId, originalAmount, discountAmount, couponCode } = req.body;
    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        userId: req.user._id,
        items,
        totalAmount,
        originalAmount: originalAmount || totalAmount,
        discountAmount: discountAmount || 0,
        couponCode: couponCode || null,
        address,
        paymentId
      });
      const createdOrder = await order.save();

      // Send Order Confirmation Email
      const message = `
        <h2>Order Confirmation</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
        <p>Total Amount Paid: ₹${totalAmount.toFixed(2)}</p>
        <p>It will be shipped to: ${address.street}, ${address.city}</p>
        <p>Thank you for shopping with ShopNest!</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'ShopNest - Order Confirmation',
        message
      });

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization: user can only download their own order, admin can download any
    const isAdmin = req.user.role === 'admin';
    const isOwnOrder = order.userId._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwnOrder) {
      return res.status(403).json({ message: 'Not authorized to download this invoice' });
    }

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ShopNest-Invoice-${order._id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('ShopNest', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Premium Minimalist Streetwear', { align: 'center' });
    doc.moveDown(0.5);

    // Invoice title
    doc.fontSize(14).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
    doc.moveDown(0.3);

    // Invoice details
    doc.fontSize(9).font('Helvetica');
    doc.text(`Invoice #: ${order._id}`, { align: 'left' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'left' });
    doc.moveDown(0.5);

    // Customer details
    doc.fontSize(10).font('Helvetica-Bold').text('BILL TO');
    doc.fontSize(9).font('Helvetica');
    doc.text(`Name: ${order.address.fullName}`);
    doc.text(`Email: ${order.userId.email}`);
    doc.moveDown(0.5);

    // Shipping address
    doc.fontSize(10).font('Helvetica-Bold').text('SHIPPING ADDRESS');
    doc.fontSize(9).font('Helvetica');
    doc.text(`${order.address.street}`);
    doc.text(`${order.address.city}, ${order.address.postalCode}`);
    doc.text(`${order.address.country}`);
    doc.moveDown(0.5);

    // Items table header
    const tableTop = doc.y;
    const col1 = 40;
    const col2 = 250;
    const col3 = 350;
    const col4 = 450;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Item', col1, tableTop);
    doc.text('Qty', col2, tableTop);
    doc.text('Price', col3, tableTop);
    doc.text('Subtotal', col4, tableTop);

    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown(0.3);

    // Items
    let itemsTop = doc.y;
    doc.fontSize(9).font('Helvetica');

    order.items.forEach((item, index) => {
      const itemName = item.productId?.name || 'Unknown Product';
      const quantity = item.qty;
      const price = item.price;
      const subtotal = quantity * price;

      doc.text(itemName, col1, itemsTop, { width: 200 });
      doc.text(quantity, col2, itemsTop);
      doc.text(`₹${price.toFixed(2)}`, col3, itemsTop);
      doc.text(`₹${subtotal.toFixed(2)}`, col4, itemsTop);

      itemsTop += 25;
    });

    doc.moveTo(40, itemsTop).lineTo(550, itemsTop).stroke();
    doc.moveDown(0.5);

    // Totals section
    const totalsStartY = doc.y;
    doc.fontSize(9).font('Helvetica');

    doc.text(`Subtotal:`, 350);
    doc.text(`₹${(order.originalAmount || order.totalAmount).toFixed(2)}`, 450);

    if (order.discountAmount && order.discountAmount > 0) {
      doc.moveDown(0.2);
      doc.text(`Discount:`, 350);
      doc.text(`-₹${order.discountAmount.toFixed(2)}`, 450);
      if (order.couponCode) {
        doc.text(`(Coupon: ${order.couponCode})`, 350, undefined, { fontSize: 8 });
      }
    }

    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`Total:`, 350);
    doc.text(`₹${order.totalAmount.toFixed(2)}`, 450);
    doc.moveDown(0.5);

    // Payment info
    doc.fontSize(9).font('Helvetica');
    doc.text(`Payment ID: ${order.paymentId}`, { align: 'left' });
    doc.text(`Order Status: ${order.status}`, { align: 'left' });
    doc.moveDown(1);

    // Footer
    doc.fontSize(8).font('Helvetica').fillColor('#666666');
    doc.text('Thank you for shopping with ShopNest!', { align: 'center' });
    doc.text('For support, contact: support@shopnest.com', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus, downloadInvoice };