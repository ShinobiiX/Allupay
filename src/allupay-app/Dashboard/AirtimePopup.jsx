import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { useBalance } from '../Balance/BalanceContext';
import { useHistory } from '../History/HistoryContext.jsx';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN

export default function AirtimePopup({ onClose }) {
  const { balance: fiatBalance, deductBalance } = useBalance();
  const { addTransaction } = useHistory();
  const [client] = useState(getClient());
  const [accountId] = useState(getAccountId());

  const [network, setNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('fiat'); // 'fiat' or 'crypto'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAmountClick = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const purchaseAmount = parseFloat(amount);

    if (!purchaseAmount || purchaseAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!/^\d{11}$/.test(phoneNumber)) {
      setError('Please enter a valid 11-digit phone number.');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'fiat') {
      // --- Fiat Payment Logic ---
      if (purchaseAmount > fiatBalance) {
        setError('Insufficient Fiat (NGN) balance.');
        setIsProcessing(false);
        return;
      }
      // Simulate payment processing
      setTimeout(() => {
        deductBalance(purchaseAmount);
        addTransaction({
          type: 'Airtime Purchase',
          note: `${network} - ${phoneNumber}`,
          amount: `- ₦${purchaseAmount.toLocaleString()}`,
        });
        setIsProcessing(false);
        onClose();
      }, 1000);
    } else {
      // --- Crypto (HBAR) Payment Logic ---
      const hbarAmount = purchaseAmount / MOCK_HBAR_TO_NGN_RATE;
      const tinybarAmount = Math.ceil(hbarAmount * 100_000_000);
      const hbarAmountForTx = Hbar.fromTinybars(tinybarAmount);
      const utilityTreasuryId = import.meta.env.VITE_TREASURY_ACCOUNT_ID;

      if (!utilityTreasuryId) {
        setError("Service configuration error. Utility treasury not set.");
        setIsProcessing(false);
        return;
      }

      try {
        const transaction = new TransferTransaction()
          .addHbarTransfer(accountId, hbarAmountForTx.negated())
          .addHbarTransfer(utilityTreasuryId, hbarAmountForTx)
          .setTransactionMemo(`Airtime: ${network} ${phoneNumber}`);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (receipt.status.toString() !== 'SUCCESS') {
          throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
        }

        addTransaction({
          type: 'Airtime Purchase (HBAR)',
          note: `${network} - ${phoneNumber}`,
          amount: `- ${hbarAmount.toFixed(4)} ℏ`,
          transactionId: txResponse.transactionId,
        });
        
        setIsProcessing(false);
        onClose();

      } catch (err) {
        setError(err.message || 'An error occurred during HBAR payment.');
        setIsProcessing(false);
      }
    }
  };

  const hbarCost = amount ? (parseFloat(amount) / MOCK_HBAR_TO_NGN_RATE).toFixed(4) : '0.00';

  return (
    <div className={styles.servicePopup}>
      <div className={styles.popupHeader}>
        <div className={styles.popupTitle}>Buy Airtime</div>
        <button className={styles.popupClose} onClick={onClose} disabled={isProcessing}>&times;</button>
      </div>
      <form className={styles.serviceForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Network</label>
          <select value={network} onChange={(e) => setNetwork(e.target.value)}>
            <option>MTN</option>
            <option>Airtel</option>
            <option>Glo</option>
            <option>9mobile</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="08012345678" />
        </div>
        <div className={styles.formGroup}>
          <label>Amount (NGN)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1000" />
        </div>
        <div className={styles.amountPresets}>
          {[100, 200, 500, 1000].map(val => (
            <button key={val} type="button" className={styles.amountBtn} onClick={() => handleAmountClick(val)}>₦{val}</button>
          ))}
        </div>

        <div className={styles.formGroup}>
            <label>Pay with:</label>
            <div className={styles.paymentMethodSelector}>
                <label className={paymentMethod === 'fiat' ? styles.active : ''}>
                    <input type="radio" name="paymentMethod" value="fiat" checked={paymentMethod === 'fiat'} onChange={() => setPaymentMethod('fiat')} />
                    Fiat (NGN)
                </label>
                <label className={paymentMethod === 'crypto' ? styles.active : ''}>
                    <input type="radio" name="paymentMethod" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                    Crypto ({hbarCost} ℏ)
                </label>
            </div>
        </div>

        {error && <p className={styles.pinError}>{error}</p>}

        <button type="submit" className={styles.formSubmitBtn} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : `Pay ₦${parseFloat(amount || 0).toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}