import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { useBalance } from '../Balance/BalanceContext';
import { useHistory } from '../History/HistoryContext';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN

const MOCK_DATA_PLANS = {
  MTN: [
    { label: '1GB', price: 300 },
    { label: '2.5GB', price: 500 },
    { label: '5GB', price: 1000 },
  ],
  Airtel: [
    { label: '1.5GB', price: 350 },
    { label: '3GB', price: 600 },
    { label: '6GB', price: 1200 },
  ],
  Glo: [
    { label: '2GB', price: 300 },
    { label: '4GB', price: 500 },
    { label: '8GB', price: 1000 },
  ],
  '9mobile': [
    { label: '1GB', price: 320 },
    { label: '2GB', price: 550 },
    { label: '4.5GB', price: 1100 },
  ],
};

export default function DataBundlePopup({ onClose }) {
  const { balance: fiatBalance, deductBalance } = useBalance();
  const { addTransaction } = useHistory();
  const [client] = useState(getClient());
  const [accountId] = useState(getAccountId());

  const [network, setNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('fiat'); // 'fiat' or 'crypto'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedPlan) {
      setError('Please select a data plan.');
      return;
    }
    if (!/^\d{11}$/.test(phoneNumber)) {
      setError('Please enter a valid 11-digit phone number.');
      return;
    }

    setIsProcessing(true);
    const purchaseAmount = selectedPlan.price;

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
          type: 'Data Purchase',
          note: `${network} ${selectedPlan.label} - ${phoneNumber}`,
          amount: `- ₦${purchaseAmount.toLocaleString()}`,
        });
        setIsProcessing(false);
        onClose();
      }, 1000);
    } else {
      // --- Crypto (HBAR) Payment Logic ---
      const hbarAmount = purchaseAmount / MOCK_HBAR_TO_NGN_RATE;
      // Convert to tinybars and ensure it's an integer to avoid SDK errors
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
          .setTransactionMemo(`Data: ${network} ${selectedPlan.label} ${phoneNumber}`);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (receipt.status.toString() !== 'SUCCESS') {
          throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
        }

        addTransaction({
          type: 'Data Purchase (HBAR)',
          note: `${network} ${selectedPlan.label} - ${phoneNumber}`,
          amount: `- ${hbarAmount.toFixed(4)} ℏ`,
          transactionId: txResponse.transactionId,
        });
        
        setIsProcessing(false);
        onClose();
        // Note: HBAR balance will update on next dashboard load.

      } catch (err) {
        setError(err.message || 'An error occurred during HBAR payment.');
        setIsProcessing(false);
      }
    }
  };

  const hbarCost = selectedPlan ? (selectedPlan.price / MOCK_HBAR_TO_NGN_RATE).toFixed(4) : '0.00';

  return (
    <div className={styles.servicePopup}>
      <div className={styles.popupHeader}>
        <div className={styles.popupTitle}>Buy Data Bundle</div>
        <button className={styles.popupClose} onClick={onClose} disabled={isProcessing}>&times;</button>
      </div>
      <form className={styles.serviceForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Network</label>
          <select value={network} onChange={(e) => { setNetwork(e.target.value); setSelectedPlan(null); }}>
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
          <label>Select Plan</label>
          <div className={styles.dataPlanGrid}>
            {MOCK_DATA_PLANS[network].map(plan => (
              <button key={plan.label} type="button" className={`${styles.dataPlanBtn} ${selectedPlan?.label === plan.label ? styles.activePlan : ''}`} onClick={() => setSelectedPlan(plan)}>
                <span className={styles.planLabel}>{plan.label}</span>
                <span className={styles.planPrice}>₦{plan.price}</span>
              </button>
            ))}
          </div>
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

        <button type="submit" className={styles.formSubmitBtn} disabled={isProcessing || !selectedPlan}>
          {isProcessing ? 'Processing...' : `Pay ₦${selectedPlan ? selectedPlan.price.toLocaleString() : '0'}`}
        </button>
      </form>
    </div>
  );
}