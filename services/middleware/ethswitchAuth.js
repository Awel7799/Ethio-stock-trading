// middleware/ethswitchAuth.js - EthSwitch Callback Verification
// Verifies webhooks and callbacks from EthSwitch

const crypto = require('crypto');
const { ethswitchConfig } = require('../config/ethswitch');
const { webhookErrorResponse } = require('../utils/responseHelper');

// Verify EthSwitch webhook signature
const verifyEthSwitchSignature = (req, res, next) => {
    try {
        // Get signature and timestamp from headers
        const receivedSignature = req.headers['x-signature'];
        const timestamp = req.headers['x-timestamp'];
        
        if (!receivedSignature || !timestamp) {
            return webhookErrorResponse(res, 'Missing signature or timestamp headers', 400);
        }

        // Check timestamp to prevent replay attacks (within 5 minutes)
        const currentTime = Date.now();
        const requestTime = parseInt(timestamp);
        const timeDifference = Math.abs(currentTime - requestTime);
        const maxTimeDifference = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (timeDifference > maxTimeDifference) {
            return webhookErrorResponse(res, 'Request timestamp is too old', 400);
        }

        // Generate expected signature
        const payload = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac('sha256', ethswitchConfig.webhookSecret)
            .update(payload + timestamp)
            .digest('hex');

        // Verify signature using timing-safe comparison
        const isValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'hex'),
            Buffer.from(receivedSignature, 'hex')
        );

        if (!isValid) {
            console.warn('Invalid EthSwitch webhook signature:', {
                received: receivedSignature,
                expected: expectedSignature,
                timestamp: timestamp,
                ip: req.ip
            });
            return webhookErrorResponse(res, 'Invalid signature', 403);
        }

        // Add verified flag to request
        req.ethswitchVerified = true;
        next();

    } catch (error) {
        console.error('EthSwitch signature verification error:', error);
        return webhookErrorResponse(res, 'Signature verification failed', 500);
    }
};

// Validate webhook payload structure
const validateWebhookPayload = (req, res, next) => {
    try {
        const { body } = req;

        // Required fields for EthSwitch webhook
        const requiredFields = [
            'transaction_id',
            'merchant_id',
            'transaction_ref',
            'status',
            'amount'
        ];

        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return webhookErrorResponse(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
        }

        // Validate merchant ID matches
        if (body.merchant_id !== ethswitchConfig.merchantId) {
            return webhookErrorResponse(res, 'Invalid merchant ID', 403);
        }

        // Validate status values
        const validStatuses = ['initiated', 'pending', 'completed', 'failed', 'cancelled'];
        if (!validStatuses.includes(body.status.toLowerCase())) {
            return webhookErrorResponse(res, 'Invalid transaction status', 400);
        }

        // Validate amount is positive number
        const amount = parseFloat(body.amount);
        if (isNaN(amount) || amount <= 0) {
            return webhookErrorResponse(res, 'Invalid amount value', 400);
        }

        // Sanitize and add validated data to request
        req.validatedWebhookData = {
            transaction_id: body.transaction_id,
            merchant_id: body.merchant_id,
            transaction_ref: body.transaction_ref,
            status: body.status.toLowerCase(),
            amount: amount,
            currency: body.currency || 'ETB',
            completed_at: body.completed_at || null,
            failed_reason: body.failed_reason || null,
            customer_info: body.customer_info || {},
            metadata: body.metadata || {}
        };

        next();

    } catch (error) {
        console.error('Webhook payload validation error:', error);
        return webhookErrorResponse(res, 'Payload validation failed', 500);
    }
};

// Rate limiting for webhook endpoints
const webhookRateLimit = (req, res, next) => {
    // Simple rate limiting - can be enhanced with Redis for distributed systems
    const ip = req.ip;
    const currentTime = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 100; // Max 100 requests per minute per IP

    if (!req.app.locals.webhookRateLimit) {
        req.app.locals.webhookRateLimit = {};
    }

    const ipRequests = req.app.locals.webhookRateLimit[ip] || [];
    
    // Remove old requests outside the window
    const validRequests = ipRequests.filter(time => currentTime - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
        return webhookErrorResponse(res, 'Rate limit exceeded', 429);
    }

    // Add current request
    validRequests.push(currentTime);
    req.app.locals.webhookRateLimit[ip] = validRequests;

    next();
};

// Log webhook requests for debugging
const logWebhookRequest = (req, res, next) => {
    console.log('EthSwitch Webhook Received:', {
        ip: req.ip,
        timestamp: new Date().toISOString(),
        headers: {
            'x-signature': req.headers['x-signature'] ? '[PRESENT]' : '[MISSING]',
            'x-timestamp': req.headers['x-timestamp'],
            'content-type': req.headers['content-type']
        },
        bodySize: JSON.stringify(req.body).length,
        transactionId: req.body?.transaction_id || 'N/A'
    });

    next();
};

// Error handler for webhook middleware
const webhookErrorHandler = (error, req, res, next) => {
    console.error('Webhook middleware error:', {
        error: error.message,
        stack: error.stack,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    return webhookErrorResponse(res, 'Webhook processing error', 500);
};

module.exports = {
    verifyEthSwitchSignature,
    validateWebhookPayload,
    webhookRateLimit,
    logWebhookRequest,
    webhookErrorHandler
};