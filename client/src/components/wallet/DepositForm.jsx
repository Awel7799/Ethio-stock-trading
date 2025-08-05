// client/src/components/wallet/DepositForm.jsx
import React, { useState } from 'react';
import BankSelector from './BankSelector';
import { initiateDeposit } from '../../services/walletApi';

export default function DepositForm ({ onDepositInitiated }){
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
      // Frontend validation
      if (!bank || !account || !amount) {
        throw new Error('All fields are required');
      }
      if (amount < 10) {
        throw new Error('Minimum deposit is 10 ETB');
      }
      if (!/^\d{13,16}$/.test(account)) {
        throw new Error('Account number must be 13-16 digits');
      }

      // Call API service
      const response = await initiateDeposit({ 
        bank_code: bank, 
        account_number: account, 
        amount: parseFloat(amount) 
      });

      // Handle different response scenarios
      if (response.mobile_redirect_url) {
        // Redirect to mobile banking app
        window.location.href = response.mobile_redirect_url;
      } else if (response.ussd_code) {
        // Show USSD code for manual input
        onDepositInitiated({
          type: 'ussd',
          code: response.ussd_code
        });
      } else {
        // Handle web flow
        onDepositInitiated({
          type: 'web',
          url: response.web_redirect_url
        });
      }
      
    } catch (err) {
      setError(err.message || 'Deposit failed. Please try again.');
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
        <label className="block text-gray-700 mb-2">Amount (ETB)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Enter amount"
          min="10"
          step="1"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Minimum deposit: 10 ETB
        </p>
      </div>
      
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-md font-medium ${
          isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Deposit Funds'
        )}
      </button>
    </form>
  );
};

