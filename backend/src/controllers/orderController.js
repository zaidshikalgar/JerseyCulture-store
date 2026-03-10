const Order = require('../models/Order');
const { createCashfreeOrder, fetchCashfreeOrder } = require('../utils/cashfree');

function makeOrderNumber() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timePart = Date.now().toString().slice(-6);
  return `JC-${timePart}-${randomPart}`;
}

function validateOrderInput(body) {
  const {
    items,
    customer,
    shippingAddress,
    paymentMethod = 'cod',
    shippingFee = 0,
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'Order items are required' };
  }

  if (!customer?.name || !customer?.email) {
    return { error: 'Customer name and email are required' };
  }

  if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postalCode || !shippingAddress?.country) {
    return { error: 'Complete shipping address is required' };
  }

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = itemsTotal + shippingFee;

  return {
    payload: {
      items,
      customer: {
        ...customer,
        email: customer.email.toLowerCase(),
      },
      shippingAddress,
      paymentMethod,
      shippingFee,
      itemsTotal,
      totalAmount,
    },
  };
}

const createOrder = async (req, res, next) => {
  try {
    if (req.user?.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot place orders' });
    }

    const { payload, error } = validateOrderInput(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const order = await Order.create({
      user: req.user?._id,
      orderNumber: makeOrderNumber(),
      ...payload,
      paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending',
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const createCashfreePaymentSession = async (req, res, next) => {
  try {
    if (req.user?.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot place orders' });
    }

    const { payload, error } = validateOrderInput(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!['upi', 'card'].includes(payload.paymentMethod)) {
      return res.status(400).json({ message: 'Cashfree is available only for UPI/Card payments' });
    }

    const order = await Order.create({
      user: req.user?._id,
      orderNumber: makeOrderNumber(),
      ...payload,
      paymentStatus: 'pending',
      status: 'pending',
    });

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const returnUrl = `${frontendBaseUrl}/order-confirmation?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customer.email)}`;

    const cashfreeOrder = await createCashfreeOrder({
      orderId: order.orderNumber,
      orderAmount: order.totalAmount,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      returnUrl,
    });

    order.cashfreeOrderId = cashfreeOrder.cf_order_id || order.orderNumber;
    order.cashfreePaymentSessionId = cashfreeOrder.payment_session_id;
    await order.save();

    return res.status(201).json({
      orderNumber: order.orderNumber,
      paymentSessionId: cashfreeOrder.payment_session_id,
      cfOrderId: cashfreeOrder.cf_order_id,
    });
  } catch (error) {
    next(error);
  }
};

const verifyCashfreePayment = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const requesterId = req.user?._id?.toString();
    const orderUserId = order.user?.toString();
    const isOwner = requesterId && orderUserId && requesterId === orderUserId;
    const isAdmin = req.user?.role === 'admin';
    const hasEmailMatch = req.body?.email && order.customer.email === String(req.body.email).toLowerCase();

    if (!isOwner && !isAdmin && !hasEmailMatch) {
      return res.status(403).json({
        message: 'Provide matching email in request body or authenticate as owner/admin',
      });
    }

    const cashfreeOrder = await fetchCashfreeOrder(order.orderNumber);
    const isPaid = cashfreeOrder?.order_status === 'PAID';

    if (isPaid) {
      order.paymentStatus = 'paid';
      order.cashfreeOrderId = cashfreeOrder.cf_order_id || order.cashfreeOrderId;
      await order.save();
    } else {
      order.paymentStatus = 'pending';
      await order.save();
    }

    return res.json({
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      cashfreeOrderStatus: cashfreeOrder?.order_status || 'UNKNOWN',
      paid: isPaid,
    });
  } catch (error) {
    next(error);
  }
};

const confirmOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cancelled order cannot be confirmed' });
    }

    if (order.status === 'confirmed') {
      return res.json(order);
    }

    order.status = 'confirmed';
    await order.save();

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const email = req.query.email ? String(req.query.email).toLowerCase() : null;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const requesterId = req.user?._id?.toString();
    const orderUserId = order.user?.toString();
    const isOwner = requesterId && orderUserId && requesterId === orderUserId;
    const isAdmin = req.user?.role === 'admin';
    const hasEmailMatch = email && order.customer.email === email;

    if (!isOwner && !isAdmin && !hasEmailMatch) {
      return res.status(403).json({
        message: 'Provide matching email query or authenticate as owner/admin',
      });
    }

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

const cancelOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const email = req.body?.email ? String(req.body.email).toLowerCase() : null;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const requesterId = req.user?._id?.toString();
    const orderUserId = order.user?.toString();
    const isOwner = requesterId && orderUserId && requesterId === orderUserId;
    const isAdmin = req.user?.role === 'admin';
    const hasEmailMatch = email && order.customer.email === email;

    if (!isOwner && !isAdmin && !hasEmailMatch) {
      return res.status(403).json({
        message: 'Provide matching email in request body or authenticate as owner/admin',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        message: `Order cannot be cancelled when status is ${order.status}`,
      });
    }

    order.status = 'cancelled';
    await order.save();

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderItemsByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const email = req.body?.email ? String(req.body.email).toLowerCase() : null;
    const updatedItems = Array.isArray(req.body?.items) ? req.body.items : null;

    if (!updatedItems || updatedItems.length === 0) {
      return res.status(400).json({ message: 'Updated items are required' });
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const requesterId = req.user?._id?.toString();
    const orderUserId = order.user?.toString();
    const isOwner = requesterId && orderUserId && requesterId === orderUserId;
    const isAdmin = req.user?.role === 'admin';
    const hasEmailMatch = email && order.customer.email === email;

    if (!isOwner && !isAdmin && !hasEmailMatch) {
      return res.status(403).json({
        message: 'Provide matching email in request body or authenticate as owner/admin',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        message: 'Only pending orders can be edited',
      });
    }

    if (updatedItems.length !== order.items.length) {
      return res.status(400).json({ message: 'Item count mismatch' });
    }

    order.items = order.items.map((item, index) => {
      const draft = updatedItems[index] || {};
      const nextSize = String(draft.size || '').trim();
      const nextQuantity = Number(draft.quantity);

      if (!nextSize) {
        throw new Error(`Size is required for item ${index + 1}`);
      }
      if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
        throw new Error(`Quantity must be a positive integer for item ${index + 1}`);
      }

      return {
        ...item.toObject(),
        size: nextSize,
        quantity: nextQuantity,
      };
    });

    order.itemsTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    order.totalAmount = order.itemsTotal + (order.shippingFee || 0);

    await order.save();
    return res.json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const deleteOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOneAndDelete({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order deleted successfully', orderNumber });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  createCashfreePaymentSession,
  verifyCashfreePayment,
  getOrderByNumber,
  cancelOrderByNumber,
  updateOrderItemsByNumber,
  confirmOrderByNumber,
  getMyOrders,
  getAllOrders,
  deleteOrderByNumber,
};
