const DEFAULT_API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';

function getCashfreeBaseUrl() {
  const env = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();
  return env === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
}

function getCashfreeCredentials() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials are not configured');
  }

  return { appId, secretKey };
}

async function cashfreeRequest(path, init = {}) {
  const { appId, secretKey } = getCashfreeCredentials();
  const baseUrl = getCashfreeBaseUrl();

  const headers = new Headers(init.headers || {});
  headers.set('x-client-id', appId);
  headers.set('x-client-secret', secretKey);
  headers.set('x-api-version', DEFAULT_API_VERSION);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && data.message
        ? String(data.message)
        : `Cashfree request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function createCashfreeOrder({
  orderId,
  orderAmount,
  customerName,
  customerEmail,
  customerPhone,
  returnUrl,
}) {
  const normalizedCustomerId = String(customerEmail || 'guest')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 45) || 'guest_user';

  return cashfreeRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      order_amount: Number(orderAmount.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: normalizedCustomerId,
        customer_name: customerName,
        customer_email: customerEmail.toLowerCase(),
        customer_phone: customerPhone || '9999999999',
      },
      order_meta: {
        return_url: returnUrl,
      },
    }),
  });
}

async function fetchCashfreeOrder(orderId) {
  return cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
  });
}

module.exports = {
  createCashfreeOrder,
  fetchCashfreeOrder,
};
