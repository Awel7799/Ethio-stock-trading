// services/tests/walletSystemTest.js
const mongoose = require('mongoose');
const WalletService = require('../services/walletService');
const MedapayTestUtils = require('../utils/medapayTestUtils');

class WalletSystemTester {
  
  constructor() {
    this.testResults = [];
  }

  // Test basic wallet creation
  async testWalletCreation() {
    console.log('🧪 Testing wallet creation...');
    
    try {
      const testUserId = new mongoose.Types.ObjectId();
      const result = await WalletService.createWallet(testUserId, 1000);
      
      this.logTest('Wallet Creation', result.success, result.message);
      return result;
    } catch (error) {
      this.logTest('Wallet Creation', false, error.message);
      return { success: false, error: error.message };
    }
  }

  // Test deposit functionality
  async testDeposit(userId) {
    console.log('💰 Testing deposit...');
    
    try {
      const depositData = MedapayTestUtils.generateTestDepositData('CBE', 2500);
      const result = await WalletService.initiateDeposit(userId, depositData);
      
      this.logTest('Deposit Transaction', result.success, result.message);
      
      if (result.success) {
        console.log(`   💳 Medapay URL: ${result.data.medapayUrl}`);
        console.log(`   💰 New Balance: ${result.data.wallet.balance} ETB`);
      }
      
      return result;
    } catch (error) {
      this.logTest('Deposit Transaction', false, error.message);
      return { success: false, error: error.message };
    }
  }

  // Test withdrawal functionality
  async testWithdrawal(userId) {
    console.log('💸 Testing withdrawal...');
    
    try {
      const withdrawalData = MedapayTestUtils.generateTestWithdrawalData('AWASH', 500);
      const result = await WalletService.initiateWithdrawal(userId, withdrawalData);
      
      this.logTest('Withdrawal Transaction', result.success, result.message);
      
      if (result.success) {
        console.log(`   💰 New Balance: ${result.data.wallet.balance} ETB`);
      }
      
      return result;
    } catch (error) {
      this.logTest('Withdrawal Transaction', false, error.message);
      return { success: false, error: error.message };
    }
  }

  // Test transaction history
  async testTransactionHistory(userId) {
    console.log('📊 Testing transaction history...');
    
    try {
      const result = await WalletService.getTransactionHistory(userId, 1, 10);
      
      this.logTest('Transaction History', result.success, result.message);
      
      if (result.success) {
        console.log(`   📝 Total Transactions: ${result.data.pagination.totalTransactions}`);
        console.log(`   📄 Current Page: ${result.data.pagination.currentPage}`);
      }
      
      return result;
    } catch (error) {
      this.logTest('Transaction History', false, error.message);
      return { success: false, error: error.message };
    }
  }

  // Test bank account validation
  testBankValidation() {
    console.log('🏦 Testing bank account validation...');
    
    const testCases = [
      { bank: 'CBE', account: '1234567890123', expected: true },
      { bank: 'CBE', account: '123456789012', expected: false }, // Too short
      { bank: 'AWASH', account: '1234567890', expected: true },
      { bank: 'AWASH', account: '12345678901234', expected: false }, // Too long
      { bank: 'INVALID', account: '1234567890', expected: true }, // Unknown bank defaults to true
    ];

    testCases.forEach(test => {
      const result = WalletService.validateBankAccount(test.bank, test.account);
      const passed = result === test.expected;
      
      this.logTest(
        `Bank Validation (${test.bank})`, 
        passed, 
        `Account ${test.account} - Expected: ${test.expected}, Got: ${result}`
      );
    });
  }

  // Test error scenarios
  async testErrorScenarios(userId) {
    console.log('❌ Testing error scenarios...');
    
    // Test withdrawal with insufficient funds
    try {
      const withdrawalData = MedapayTestUtils.generateTestWithdrawalData('CBE', 999999);
      const result = await WalletService.initiateWithdrawal(userId, withdrawalData);
      
      this.logTest(
        'Insufficient Funds Error', 
        !result.success && result.message.includes('Insufficient'), 
        result.message
      );
    } catch (error) {
      this.logTest('Insufficient Funds Error', false, error.message);
    }

    // Test invalid deposit amount
    try {
      const depositData = { ...MedapayTestUtils.generateTestDepositData(), amount: -100 };
      const result = await WalletService.initiateDeposit(userId, depositData);
      
      this.logTest(
        'Invalid Amount Error', 
        !result.success, 
        result.message
      );
    } catch (error) {
      this.logTest('Invalid Amount Error', true, 'Caught invalid amount error');
    }
  }

  // Test webhook simulation
  async testWebhookSimulation() {
    console.log('🔄 Testing webhook simulation...');
    
    try {
      const scenarios = ['SUCCESS_IMMEDIATE', 'SUCCESS_DELAYED', 'INSUFFICIENT_FUNDS'];
      
      scenarios.forEach(scenario => {
        const webhook = MedapayTestUtils.generateMedapayWebhook('TEST_TXN_123', scenario);
        const isValid = webhook.event === 'transaction.status_changed' && webhook.data;
        
        this.logTest(
          `Webhook ${scenario}`, 
          isValid, 
          `Generated webhook for ${scenario}`
        );
      });
    } catch (error) {
      this.logTest('Webhook Simulation', false, error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Wallet System Tests...\n');
    
    // Check sandbox environment
    const envCheck = MedapayTestUtils.validateSandboxEnvironment();
    console.log('🔧 Environment Check:', envCheck.isValid ? '✅ Valid' : '⚠️ Warning');
    if (envCheck.warnings.length > 0) {
      console.log('   Warnings:', envCheck.warnings.join(', '));
    }
    console.log();

    let testUserId = null;

    try {
      // 1. Test wallet creation
      const walletResult = await this.testWalletCreation();
      if (walletResult.success) {
        testUserId = walletResult.data.wallet.userId;
      }
      console.log();

      // 2. Test bank validation
      this.testBankValidation();
      console.log();

      if (testUserId) {
        // 3. Test deposit
        await this.testDeposit(testUserId);
        console.log();

        // 4. Test withdrawal
        await this.testWithdrawal(testUserId);
        console.log();

        // 5. Test transaction history
        await this.testTransactionHistory(testUserId);
        console.log();

        // 6. Test error scenarios
        await this.testErrorScenarios(testUserId);
        console.log();
      }

      // 7. Test webhook simulation
      await this.testWebhookSimulation();
      console.log();

    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
    }

    // Print results summary
    this.printResults();
  }

  // Helper methods
  logTest(testName, passed, message) {
    const result = {
      test: testName,
      passed,
      message,
      timestamp: new Date()
    };
    
    this.testResults.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} ${testName}: ${message}`);
  }

  printResults() {
    console.log('📊 Test Results Summary:');
    console.log('========================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => console.log(`   • ${r.test}: ${r.message}`));
    }
    
    console.log('\n🎉 Test suite completed!');
  }
}

// Export for use in other files
module.exports = WalletSystemTester;

// Run tests if this file is executed directly
if (require.main === module) {
  // You'll need to connect to your MongoDB first
  const runTests = async () => {
    try {
      // Connect to MongoDB (replace with your connection string)
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethio-stock-trading');
      console.log('📊 Connected to MongoDB\n');
      
      const tester = new WalletSystemTester();
      await tester.runAllTests();
      
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      await mongoose.disconnect();
      console.log('\n📊 Disconnected from MongoDB');
      process.exit(0);
    }
  };

  runTests();
}