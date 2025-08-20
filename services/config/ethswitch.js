// config/ethswitch.js - EthSwitch Configuration & Mode Switching
// Automatically handles test/production switching based on ETHSWITCH_MODE

require("dotenv").config() // Ensure dotenv is loaded to access environment variables

const ETHSWITCH_MODE = process.env.ETHSWITCH_MODE || "test" // Default to 'test' if not explicitly set

const ethswitchConfig = {
  // Current operating mode (e.g., 'test', 'sandbox', 'production')
  mode: ETHSWITCH_MODE,

  // Base URL for EthSwitch API
  baseURL:
    ETHSWITCH_MODE === "production"
      ? process.env.ETHSWITCH_BASE_URL_PROD // Use production URL
      : process.env.ETHSWITCH_BASE_URL_TEST, // Use test/sandbox URL

  // API Key for authentication
  apiKey: ETHSWITCH_MODE === "production" ? process.env.ETHSWITCH_API_KEY_PROD : process.env.ETHSWITCH_API_KEY_TEST,

  // API Secret for signature generation
  apiSecret:
    ETHSWITCH_MODE === "production" ? process.env.ETHSWITCH_API_SECRET_PROD : process.env.ETHSWITCH_API_SECRET_TEST,

  // Your Merchant ID provided by EthSwitch
  merchantId:
    ETHSWITCH_MODE === "production" ? process.env.ETHSWITCH_MERCHANT_ID_PROD : process.env.ETHSWITCH_MERCHANT_ID_TEST,

  // Secret for verifying incoming webhooks from EthSwitch
  webhookSecret:
    ETHSWITCH_MODE === "production"
      ? process.env.ETHSWITCH_WEBHOOK_SECRET_PROD
      : process.env.ETHSWITCH_WEBHOOK_SECRET_TEST,

  // Your central bank account details registered with EthSwitch
  // These are typically static for your application
  centralBankAccount: process.env.ETHSWITCH_CENTRAL_BANK_ACCOUNT,
  centralBankName: process.env.ETHSWITCH_CENTRAL_BANK_NAME || "Commercial Bank of Ethiopia",
  centralBankCode: process.env.ETHSWITCH_CENTRAL_BANK_CODE || "CBE",

  // List of supported Ethiopian banks for transactions
  supportedBanks: [
    { code: "CBE", name: "Commercial Bank of Ethiopia" },
    { code: "DASH", name: "Dashen Bank" },
    { code: "AWASH", name: "Awash International Bank" },
    { code: "ABYSS", name: "Bank of Abyssinia" },
    { code: "COOP", name: "Cooperative Bank of Oromia" },
    { code: "DBE", name: "Development Bank of Ethiopia" },
    { code: "UNITED", name: "United Bank S.C." },
    { code: "LION", name: "Lion International Bank" },
    { code: "NIB", name: "Nib International Bank" },
    { code: "WEGAGEN", name: "Wegagen Bank" },
  ],
}

/**
 * Validates that all essential EthSwitch configuration variables are present.
 * Throws an error if any required configuration is missing.
 */
const validateConfig = () => {
  const requiredKeys = [
    "baseURL",
    "apiKey",
    "apiSecret",
    "merchantId",
    "webhookSecret",
    "centralBankAccount",
    "centralBankCode", // Added centralBankCode as required
  ]

  const missing = requiredKeys.filter((key) => !ethswitchConfig[key])

  if (missing.length > 0) {
    throw new Error(
      `EthSwitch Configuration Error: Missing required environment variables for mode '${ethswitchConfig.mode}': ${missing.join(", ")}. Please check your .env file or Vercel environment variables.`,
    )
  }

  console.log(`✅ EthSwitch configured successfully in ${ethswitchConfig.mode} mode.`)
  return true
}

module.exports = {
  ethswitchConfig,
  validateConfig,
}
