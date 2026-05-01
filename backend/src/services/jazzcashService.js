const crypto = require('crypto');
const config = require('../config/config');

const SANDBOX_URL = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';
const PRODUCTION_URL = 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';

function getPaymentUrl() {
  return config.jazzcashEnv === 'production' ? PRODUCTION_URL : SANDBOX_URL;
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function generateSecureHash(params) {
  const integrationKey = config.jazzcashIntegrationKey;
  // Sort all param keys alphabetically, concatenate values
  const sortedKeys = Object.keys(params).sort();
  const hashString = integrationKey + '&' + sortedKeys.map((k) => params[k]).join('&');
  return crypto.createHmac('sha256', integrationKey).update(hashString).digest('hex').toUpperCase();
}

/**
 * Build the JazzCash Hosted Checkout form params for a given order.
 * @param {object} opts
 * @param {string} opts.txnRefNo   - Unique transaction reference (e.g. T20260327120000)
 * @param {number} opts.amount     - Amount in PKR (will be converted to paisa internally)
 * @param {string} opts.billRef    - Short bill reference (e.g. courseId)
 * @param {string} opts.description
 * @param {string} opts.returnUrl  - Full URL JazzCash will POST back to
 */
function buildPaymentParams({ txnRefNo, amount, billRef, description, returnUrl }) {
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 60 * 1000); // 30 min expiry

  const params = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: config.jazzcashMerchantId,
    pp_SubMerchantID: '',
    pp_Password: config.jazzcashPassword,
    pp_BankID: 'TBANK',
    pp_ProductID: 'RETL',
    pp_TxnRefNo: txnRefNo,
    pp_Amount: String(Math.round(amount * 100)), // paisa
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: formatDateTime(now),
    pp_BillReference: billRef,
    pp_Description: description,
    pp_TxnExpiryDateTime: formatDateTime(expiry),
    pp_ReturnURL: returnUrl,
  };

  params.pp_SecureHash = generateSecureHash(params);

  return {
    paymentUrl: getPaymentUrl(),
    params,
  };
}

/**
 * Validate the callback response from JazzCash.
 * Returns true if hash is valid and payment was successful.
 */
function validateCallback(postData) {
  const receivedHash = postData.pp_SecureHash;
  if (!receivedHash) return false;

  // Re-compute hash without pp_SecureHash
  const { pp_SecureHash, ...rest } = postData;
  const computedHash = generateSecureHash(rest);

  if (computedHash !== receivedHash) return false;

  // pp_ResponseCode '000' means success
  return postData.pp_ResponseCode === '000';
}

module.exports = { buildPaymentParams, validateCallback };
