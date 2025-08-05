// client/src/components/wallet/WithdrawForm.jsx
import React, { useState } from 'react';
import BankSelector from './BankSelector';
import { initiateWithdrawal } from '../../services/walletApi';

const WithdrawForm = ({ balance, onWithdrawalInitiated }) => {
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validation matching backend rules
      if (!bank || !account || !amount) {
        throw new Error('All fields are required');
      }
      if (amount < 50) {
        throw new Error('Minimum withdrawal is 50 ETB');
      }
      if (amount > balance) {
        throw new Error('Insufficient wallet balance');
      }
      if (!/^\d{13,16}$/.test(account)) {
        throw new Error('Account number must be 13-16 digits');
      }

      // Call API service
      const response = await initiateWithdrawal({ 
        bank_code: bank, 
        account_number: account, 
        amount: parseFloat(amount) 
      });

      // Handle different response scenarios
      if (response.mobile_redirect_url) {
        window.location.href = response.mobile_redirect_url;
      } else if (response.ussd_code) {
        onWithdrawalInitiated({
          type: 'ussd',
          code: response.ussd_code,
          newBalance: response.new_balance
        });
      } else {
        onWithdrawalInitiated({
          type: 'web',
          url: response.web_redirect_url,
          newBalance: response.new_balance
        });
      }
      
    } catch (err) {
      setError(err.message || 'Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BankSelector selectedBank={bank} onChange={setBank} />
      
      <div>
        <label className="block text-gray-700 mb-2">Account Number</label>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Enter your 13-16 digit account number"
          pattern="\d{13,16}"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2">
          Amount (ETB) - Available: {balance.toLocaleString()} ETB
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Enter amount"
          min="50"
          max={balance}
          step="1"
          required
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Minimum withdrawal: 50 ETB</span>
          <span>Max: {balance.toLocaleString()} ETB</span>
        </div>
      </div>
      
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-md font-medium ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isLoading ? 'Processing...' : 'Withdraw Funds'}
      </button>
    </form>
  );
};

export default WithdrawForm;