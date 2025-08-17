// utils/responseHelper.js - Standardized Responses
// Provides consistent response formatting across all wallet endpoints

// Success response helper
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

// Error response helper
const errorResponse = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    // Add validation errors if provided
    if (errors && Array.isArray(errors) && errors.length > 0) {
        response.errors = errors;
    }

    // Log error for debugging (exclude sensitive data)
    if (statusCode >= 500) {
        console.error('Server Error:', {
            message,
            statusCode,
            timestamp: response.timestamp
        });
    }

    return res.status(statusCode).json(response);
};

// Validation error response
const validationErrorResponse = (res, errors) => {
    return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: Array.isArray(errors) ? errors : [errors],
        timestamp: new Date().toISOString()
    });
};

// Not found response
const notFoundResponse = (res, resource = 'Resource') => {
    return res.status(404).json({
        success: false,
        message: `${resource} not found`,
        timestamp: new Date().toISOString()
    });
};

// Unauthorized response
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
        success: false,
        message,
        timestamp: new Date().toISOString()
    });
};

// Forbidden response
const forbiddenResponse = (res, message = 'Access forbidden') => {
    return res.status(403).json({
        success: false,
        message,
        timestamp: new Date().toISOString()
    });
};

// Server error response
const serverErrorResponse = (res, message = 'Internal server error') => {
    console.error('Server Error:', {
        message,
        timestamp: new Date().toISOString()
    });

    return res.status(500).json({
        success: false,
        message,
        timestamp: new Date().toISOString()
    });
};

// Transaction response formatter
const transactionResponse = (transaction, includeDetails = true) => {
    const baseTransaction = {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at
    };

    if (includeDetails) {
        return {
            ...baseTransaction,
            ethswitch_transaction_id: transaction.ethswitch_transaction_id,
            bank_name: transaction.bank_name,
            bank_account: transaction.bank_account ? 
                `***${transaction.bank_account.slice(-4)}` : null, // Mask account number
            description: transaction.description
        };
    }

    return baseTransaction;
};

// Wallet balance response formatter
const walletBalanceResponse = (wallet, includeDetails = true) => {
    const baseWallet = {
        balance: wallet.balance,
        updated_at: wallet.updated_at
    };

    if (includeDetails) {
        return {
            ...baseWallet,
            user_id: wallet.user_id,
            created_at: wallet.created_at
        };
    }

    return baseWallet;
};

// Pagination response formatter
const paginationResponse = (data, page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
        data,
        pagination: {
            current_page: page,
            per_page: limit,
            total_items: total,
            total_pages: totalPages,
            has_next_page: page < totalPages,
            has_previous_page: page > 1
        }
    };
};

// Bank list response formatter
const bankListResponse = (banks) => {
    return banks.map(bank => ({
        code: bank.code,
        name: bank.name
    }));
};

// Transaction initiation response
const transactionInitiationResponse = (transaction, ethswitchData) => {
    return {
        transaction: {
            id: transaction._id,
            amount: transaction.amount,
            type: transaction.type,
            status: transaction.status,
            ethswitch_transaction_id: transaction.ethswitch_transaction_id,
            created_at: transaction.created_at
        },
        ethswitch: {
            redirect_url: ethswitchData?.redirect_url || null,
            message: ethswitchData?.message || 'Transaction initiated successfully'
        }
    };
};

// Webhook response helpers
const webhookSuccessResponse = (res, message = 'Webhook processed successfully') => {
    return res.status(200).json({
        success: true,
        message,
        timestamp: new Date().toISOString()
    });
};

const webhookErrorResponse = (res, message = 'Webhook processing failed', statusCode = 400) => {
    console.error('Webhook Error:', {
        message,
        statusCode,
        timestamp: new Date().toISOString()
    });

    return res.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString()
    });
};

// Clean sensitive data from responses
const sanitizeResponse = (data) => {
    if (!data || typeof data !== 'object') return data;

    const sensitive = ['password', 'apiKey', 'apiSecret', 'webhookSecret'];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach(key => {
        if (sensitive.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeResponse(sanitized[key]);
        }
    });

    return sanitized;
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    serverErrorResponse,
    transactionResponse,
    walletBalanceResponse,
    paginationResponse,
    bankListResponse,
    transactionInitiationResponse,
    webhookSuccessResponse,
    webhookErrorResponse,
    sanitizeResponse
};