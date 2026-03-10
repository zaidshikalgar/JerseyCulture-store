const express = require('express');
const {
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
} = require('../controllers/orderController');
const { protect, optionalProtect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/cashfree/session', protect, createCashfreePaymentSession);
router.post('/cashfree/verify/:orderNumber', optionalProtect, verifyCashfreePayment);
router.post('/cancel/:orderNumber', optionalProtect, cancelOrderByNumber);
router.post('/update-items/:orderNumber', optionalProtect, updateOrderItemsByNumber);
router.post('/confirm/:orderNumber', protect, adminOnly, confirmOrderByNumber);
router.delete('/:orderNumber', protect, adminOnly, deleteOrderByNumber);
router.get('/track/:orderNumber', optionalProtect, getOrderByNumber);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
