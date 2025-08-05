// client/src/components/wallet/BankSelector.jsx
import React from 'react';

export default function BankSelector ({ selectedBank, onChange }){
  // Ethiopian banks with their codes and names
  const banks = [
    { code: 'cbe', name: 'Commercial Bank of Ethiopia' },
    { code: 'awash', name: 'Awash Bank' },
    { code: 'dashen', name: 'Dashen Bank' },
    { code: 'nib', name: 'NIB International Bank' },
    { code: 'boa', name: 'Bank of Abyssinia' },
    { code: 'wegagen', name: 'Wegagen Bank' },
    { code: 'united', name: 'United Bank' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Select Bank</label>
      <select
        value={selectedBank}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-md bg-white"
        required
      >
        <option value="">-- Choose your bank --</option>
        {banks.map((bank) => (
          <option key={bank.code} value={bank.code}>
            {bank.name}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-2">
        You'll be redirected to your bank's mobile app for confirmation
      </p>
    </div>
  );
};

