import React, { useState, useEffect, useCallback } from 'react';
import styles from './Dashboard.module.css';
import { useBalance } from '../Balance/BalanceContext.jsx';
import { useHistory } from '../History/HistoryContext';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const DISCOS = [
    { id: 'ikeja', name: 'Ikeja Electric (IKEDC)' },
    { id: 'eko', name: 'Eko Electric (EKEDC)' },
    { id: 'abuja', name: 'Abuja Electric (AEDC)' },
    { id: 'kano', name: 'Kano Electric (KEDCO)' },
    { id: 'enugu', name: 'Enugu Electric (EEDC)' },
    { id: 'portharcourt', name: 'Port Harcourt Electric (PHED)' },
    { id: 'ibadan', name: 'Ibadan Electric (IBEDC)' },
    { id: 'kaduna', name: 'Kaduna Electric (KAEDCO)' },
    { id: 'jos', name: 'Jos Electric (JEDplc)' },
    { id: 'benin', name: 'Benin Electric (BEDC)' },
];

const PRESET_AMOUNTS = [2000, 5000, 10000, 15000, 20000];
const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN

// Mock validation database
const METER_DB = {
    '04123456789': 'John Doe',
    '04987654321': 'Jane Smith',
};

export default function ElectricityPopup({ onClose }) {
  const { balance: fiatBalance, deductBalance } = useBalance();
  const { addTransaction } = useHistory();
  const [client] = useState(getClient());
  const [accountId] = useState(getAccountId());

  const [formState, setFormState] = useState({
    meterType: 'prepaid',
    disco: '',
    meterNumber: '',
    amount: '',
  });
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [meterError, setMeterError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('fiat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  const validateMeter = useCallback(async (meterNumber, disco) => {
    if (!meterNumber || !disco) return;
    setIsLoadingCustomer(true);
    setCustomerName('');
    setMeterError('');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const name = METER_DB[meterNumber];
    if (name) {
      setCustomerName(name);
    } else {
      setMeterError('Invalid meter number');
    }
    setIsLoadingCustomer(false);
  }, []);

  useEffect(() => {
    if (formState.meterNumber.length === 11 && formState.disco) {
      validateMeter(formState.meterNumber, formState.disco);
    }
  }, [formState.meterNumber, formState.disco, validateMeter]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };
  const handleAmountClick = (amount) => {
    setFormState(prevState => ({ ...prevState, amount: amount.toString() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  const handlePayment = async () => {
    setMeterError('');
    const purchaseAmount = Number(formState.amount);

    if (!customerName || !purchaseAmount || purchaseAmount <= 0) {
        setMeterError('Please verify meter and enter a valid amount.');
        return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'fiat') {
        if (purchaseAmount > fiatBalance) {
            setMeterError('Insufficient Fiat (NGN) balance.');
            setIsProcessing(false);
            return;
        }
        setTimeout(() => {
            deductBalance(purchaseAmount);
            const mockToken = '1234-5678-9012-3456-7890';
            addTransaction({
                type: 'Utility Bill',
                note: `Electricity Token: ${mockToken}`,
                amount: `- ₦${purchaseAmount.toLocaleString()}`,
            });
            setIsProcessing(false);
            // Show token popup instead of alert
            setGeneratedToken(mockToken);
            setShowTokenPopup(true);
        }, 1000);
    } else {
        const hbarAmount = purchaseAmount / MOCK_HBAR_TO_NGN_RATE;
        const tinybarAmount = Math.ceil(hbarAmount * 100_000_000);
        const hbarAmountForTx = Hbar.fromTinybars(tinybarAmount);
        const utilityTreasuryId = import.meta.env.VITE_TREASURY_ACCOUNT_ID;

        if (!utilityTreasuryId) {
            setMeterError("Service configuration error. Utility treasury not set.");
            setIsProcessing(false);
            return;
        }

        try {
            const transaction = new TransferTransaction()
                .addHbarTransfer(accountId, hbarAmountForTx.negated())
                .addHbarTransfer(utilityTreasuryId, hbarAmountForTx)
                .setTransactionMemo(`Electricity: ${formState.meterNumber}`);

            const txResponse = await transaction.execute(client);
            const receipt = await txResponse.getReceipt(client);

            if (receipt.status.toString() !== 'SUCCESS') {
                throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
            }

            const mockToken = '1234-5678-9012-3456-7890';
            addTransaction({
                type: 'Utility Bill (HBAR)',
                note: `Electricity Token: ${mockToken}`,
                amount: `- ${hbarAmount.toFixed(4)} ℏ`,
            });
            
            setIsProcessing(false);
            // Show token popup instead of alert
            setGeneratedToken(mockToken);
            setShowTokenPopup(true);
        } catch (err) {
            setMeterError(err.message || 'An error occurred during HBAR payment.');
            setIsProcessing(false);
        }
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken.replace(/ - /g, ''));
    alert('Token copied to clipboard!');
  };

  const handleShareToken = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Your Electricity Token',
        text: `Here is your electricity token for ${customerName}:\n${generatedToken}`,
      });
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };

  const hbarCost = formState.amount ? (parseFloat(formState.amount) / MOCK_HBAR_TO_NGN_RATE).toFixed(4) : '0.00';

  return (
    <>
      <div className={`${styles.servicePopup} ${showTokenPopup ? styles.blurred : ''}`} role="dialog" aria-modal="true">
        <div className={styles.popupHeader}>
          <div className={styles.popupTitle}>Pay Electricity Bill</div>
          <button className={styles.popupClose} onClick={onClose} disabled={isProcessing}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.serviceForm}>
          <div className={styles.formGroup}>
            <label htmlFor="meterType">Meter Type</label>
            <select id="meterType" required value={formState.meterType} onChange={handleInputChange}>
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="disco">Distribution Company</label>
            <select id="disco" required value={formState.disco} onChange={handleInputChange}>
              <option value="">Select Disco</option>
              {DISCOS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="meterNumber">Meter Number</label>
            <input id="meterNumber" type="text" placeholder="Enter 11-digit meter number" required value={formState.meterNumber} onChange={handleInputChange} maxLength="11" />
            {isLoadingCustomer && <div className={styles.meterStatus}>Validating...</div>}
            {customerName && <div className={styles.customerNameDisplay}>✓ {customerName}</div>}
            {meterError && <div className={styles.meterError}>{meterError}</div>}
          </div>
          <div className={styles.amountPresets}>
            {PRESET_AMOUNTS.map(amount => (
              <button key={amount} type="button" className={styles.amountBtn} onClick={() => handleAmountClick(amount)}>
                ₦{amount / 1000}k
              </button>
            ))}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Amount</label>
            <input id="amount" type="number" placeholder="Enter amount" required value={formState.amount} onChange={handleInputChange} />
          </div>

          <div className={styles.formGroup}>
              <label>Pay with:</label>
              <div className={styles.paymentMethodSelector}>
                  <label className={paymentMethod === 'fiat' ? styles.active : ''}><input type="radio" name="paymentMethod" value="fiat" checked={paymentMethod === 'fiat'} onChange={() => setPaymentMethod('fiat')} /> Fiat (NGN)</label>
                  <label className={paymentMethod === 'crypto' ? styles.active : ''}><input type="radio" name="paymentMethod" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} /> Crypto ({hbarCost} ℏ)</label>
              </div>
          </div>

          {meterError && <p className={styles.pinError}>{meterError}</p>}

          <button type="submit" className={styles.formSubmitBtn} disabled={!customerName || !formState.amount || isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ₦${Number(formState.amount || 0).toLocaleString()}`}
          </button>
        </form>
      </div>

      {showTokenPopup && (
        <div className={styles.tokenPopup}>
            <div className={styles.popupTitle}>Purchase Successful!</div>
            <p className={styles.pinSubtitle}>Here is the token for {customerName}:</p>
            <div className={styles.tokenDisplay}>{generatedToken}</div>
            <div className={styles.tokenActions}>
                <button onClick={handleCopyToken} className={styles.tokenBtn}>Copy</button>
                <button onClick={handleShareToken} className={styles.tokenBtn}>Share</button>
            </div>
            <button onClick={onClose} className={styles.formSubmitBtn}>Done</button>
        </div>
      )}
    </>
  );
}