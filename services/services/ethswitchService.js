// ===== 1. Simple EthSwitch Service (services/ethswitchService.js) =====
const axios = require('axios');

class SimpleEthSwitchService {
  constructor() {
    this.baseURL = process.env.ETHSWITCH_API_URL || 'https://api.ethswitch.com/v1';
    this.merchantId = process.env.ETHSWITCH_MERCHANT_ID;
    this.apiKey = process.env.ETHSWITCH_API_KEY;
  }

  // Ethiopian banks with their mobile banking deep link patterns
  getBankInfo(bankCode) {
    const banks = {
      cbe: {
        name: "Commercial Bank of Ethiopia",
        code: "80001",
        mobileApp: "cbemobile",
        color: "#1e40af"
      },
      awash: {
        name: "Awash Bank",
        code: "80002", 
        mobileApp: "awashbank",
        color: "#dc2626"
      },
      dashen: {
        name: "Dashen Bank",
        code: "80003",
        mobileApp: "dashenbank",
        color: "#059669"
      },
      nib: {
        name: "NIB International Bank",
        code: "80004",
        mobileApp: "nibbank",
        color: "#7c3aed"
      },
      boa: {
        name: "Bank of Abyssinia", 
        code: "80005",
        mobileApp: "boabank",
        color: "#ea580c"
      },
      wegagen: {
        name: "Wegagen Bank",
        code: "80006",
        mobileApp: "wegagenbank",
        color: "#0891b2"
      },
      united: {
        name: "United Bank",
        code: "80007",
        mobileApp: "unitedbank",
        color: "#be123c"
      }
    };
    return banks[bankCode] || null;
  }

  // Generate transaction ID
  generateTransactionId(type, userId) {
    const prefix = type === 'deposit' ? 'DEP' : 'WTH';
    const timestamp = Date.now();
    return `${prefix}_${userId}_${timestamp}`;
  }

  // Initiate deposit - returns mobile banking redirect URL
  async initiateDeposit(userId, amount, bankCode) {
    try {
      const bankInfo = this.getBankInfo(bankCode);
      if (!bankInfo) {
        throw new Error('Unsupported bank');
      }

      const transactionId = this.generateTransactionId('deposit', userId);
      
      // Call EthSwitch API to initiate deposit
      const response = await axios.post(`${this.baseURL}/deposits/initiate`, {
        merchant_id: this.merchantId,
        transaction_id: transactionId,
        amount: amount,
        currency: 'ETB',
        bank_code: bankInfo.code,
        customer_id: userId,
        return_url: `${process.env.APP_URL}/wallet/deposit/callback`,
        webhook_url: `${process.env.APP_URL}/api/webhooks/ethswitch`
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        transaction_id: transactionId,
        ethswitch_reference: response.data.reference,
        mobile_redirect_url: response.data.mobile_redirect_url, // This opens the banking app
        web_redirect_url: response.data.web_redirect_url, // Fallback for web
        status: 'pending'
      };
    } catch (error) {
      throw new Error(`Failed to initiate deposit: ${error.message}`);
    }
  }

  // Initiate withdrawal - returns mobile banking redirect URL  
  async initiateWithdrawal(userId, amount, bankCode) {
    try {
      const bankInfo = this.getBankInfo(bankCode);
      if (!bankInfo) {
        throw new Error('Unsupported bank');
      }

      const transactionId = this.generateTransactionId('withdrawal', userId);
      
      // Call EthSwitch API to initiate withdrawal
      const response = await axios.post(`${this.baseURL}/withdrawals/initiate`, {
        merchant_id: this.merchantId,
        transaction_id: transactionId,
        amount: amount,
        currency: 'ETB',
        bank_code: bankInfo.code,
        customer_id: userId,
        return_url: `${process.env.APP_URL}/wallet/withdrawal/callback`,
        webhook_url: `${process.env.APP_URL}/api/webhooks/ethswitch`
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        transaction_id: transactionId,
        ethswitch_reference: response.data.reference,
        mobile_redirect_url: response.data.mobile_redirect_url,
        web_redirect_url: response.data.web_redirect_url,
        status: 'pending'
      };
    } catch (error) {
      throw new Error(`Failed to initiate withdrawal: ${error.message}`);
    }
  }

  // Check transaction status
  async getTransactionStatus(ethswitchReference) {
    try {
      const response = await axios.get(`${this.baseURL}/transactions/${ethswitchReference}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }
}

module.exports = SimpleEthSwitchService;