import React, { useState, useEffect, useCallback } from 'react';
import styles from './Dashboard.module.css';
import { useBalance } from '../Balance/BalanceContext.jsx';
import { useHistory } from '../History/HistoryContext.jsx';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const GAMING_PROVIDERS = [
    { id: 'bet9ja', name: 'Bet9ja' },
    { id: 'nairabet', name: 'NairaBET' },
    { id: 'sportybet', name: 'SportyBet' },
    { id: 'betking', name: 'BetKing' },
];

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN

// Mock validation database
const GAMING_ACCOUNTS_DB = {
    'bet9ja-123456': 'Tunde Adebayo',
    'nairabet-789012': 'Funke Akindele',
    'sportybet-345678': 'Wizkid Balogun',
    'betking-901234': 'Davido Adeleke',
};

export default function GamingPopup({ onClose }) {
    const { balance: fiatBalance, deductBalance } = useBalance();
    const { addTransaction } = useHistory();
    const [client] = useState(getClient());
    const [accountId] = useState(getAccountId());

    const [formState, setFormState] = useState({ provider: '', userId: '', amount: '' });
    const [customerName, setCustomerName] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('fiat');
    const [isProcessing, setIsProcessing] = useState(false);

    const validateAccount = useCallback(async (provider, userId) => {
        if (!provider || !userId) return;
        setIsValidating(true);
        setCustomerName('');
        setValidationError('');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

        const accountKey = `${provider}-${userId}`;
        const name = GAMING_ACCOUNTS_DB[accountKey];

        if (name) {
            setCustomerName(name);
        } else {
            setValidationError('Invalid User ID for this provider.');
        }
        setIsValidating(false);
    }, []);

    useEffect(() => {
        if (formState.provider && formState.userId.length >= 6) {
            validateAccount(formState.provider, formState.userId);
        }
    }, [formState.provider, formState.userId, validateAccount]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
        setCustomerName('');
        setValidationError('');
    };

    const handleAmountClick = (amount) => {
        setFormState(prevState => ({ ...prevState, amount: amount.toString() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        const purchaseAmount = Number(formState.amount);

        if (!customerName || !purchaseAmount || purchaseAmount <= 0) {
            setValidationError('Please fill all fields and enter a valid amount.');
            return;
        }

        setIsProcessing(true);

        if (paymentMethod === 'fiat') {
            if (purchaseAmount > fiatBalance) {
                setValidationError('Insufficient Fiat (NGN) balance.');
                setIsProcessing(false);
                return;
            }
            setTimeout(() => {
                deductBalance(purchaseAmount);
                addTransaction({
                    type: 'Gaming Top-up',
                    note: `${formState.provider} for ${customerName}`,
                    amount: `- ₦${purchaseAmount.toLocaleString()}`,
                });
                setIsProcessing(false);
                onClose();
            }, 1000);
        } else {
            const hbarAmount = purchaseAmount / MOCK_HBAR_TO_NGN_RATE;
            const tinybarAmount = Math.ceil(hbarAmount * 100_000_000);
            const hbarAmountForTx = Hbar.fromTinybars(tinybarAmount);
            const utilityTreasuryId = import.meta.env.VITE_TREASURY_ACCOUNT_ID;

            if (!utilityTreasuryId) {
                setValidationError("Service configuration error. Utility treasury not set.");
                setIsProcessing(false);
                return;
            }

            try {
                const transaction = new TransferTransaction()
                    .addHbarTransfer(accountId, hbarAmountForTx.negated())
                    .addHbarTransfer(utilityTreasuryId, hbarAmountForTx)
                    .setTransactionMemo(`Gaming: ${formState.provider} ${formState.userId}`);

                const txResponse = await transaction.execute(client);
                const receipt = await txResponse.getReceipt(client);

                if (receipt.status.toString() !== 'SUCCESS') {
                    throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
                }

                addTransaction({
                    type: 'Gaming Top-up (HBAR)',
                    note: `${formState.provider} for ${customerName}`,
                    amount: `- ${hbarAmount.toFixed(4)} ℏ`,
                    transactionId: txResponse.transactionId,
                });
                
                setIsProcessing(false);
                onClose();
            } catch (err) {
                setValidationError(err.message || 'An error occurred during HBAR payment.');
                setIsProcessing(false);
            }
        }
    };

    const hbarCost = formState.amount ? (parseFloat(formState.amount) / MOCK_HBAR_TO_NGN_RATE).toFixed(4) : '0.00';

    return (
        <div className={styles.servicePopup} role="dialog" aria-modal="true">
            <div className={styles.popupHeader}>
                <div className={styles.popupTitle}>Sports & Gaming Top-up</div>
                <button className={styles.popupClose} onClick={onClose} disabled={isProcessing}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.serviceForm}>
                <div className={styles.formGroup}><label htmlFor="provider">Gaming Provider</label><select id="provider" required value={formState.provider} onChange={handleInputChange}><option value="">Select Provider</option>{GAMING_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div className={styles.formGroup}><label htmlFor="userId">User ID</label><input id="userId" type="text" placeholder="Enter your User ID" required value={formState.userId} onChange={handleInputChange} />{isValidating && <div className={styles.meterStatus}>Validating...</div>}{customerName && <div className={styles.customerNameDisplay}>✓ {customerName}</div>}{validationError && <div className={styles.meterError}>{validationError}</div>}</div>
                <div className={styles.amountPresets}>{PRESET_AMOUNTS.map(amount => (<button key={amount} type="button" className={styles.amountBtn} onClick={() => handleAmountClick(amount)}>₦{amount / 1000}k</button>))}</div>
                <div className={styles.formGroup}><label htmlFor="amount">Amount</label><input id="amount" type="number" placeholder="Or enter amount" required value={formState.amount} onChange={handleInputChange} /></div>
                
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

                {validationError && <p className={styles.pinError}>{validationError}</p>}

                <button type="submit" className={styles.formSubmitBtn} disabled={!customerName || !formState.amount || isProcessing}>
                    {isProcessing ? 'Processing...' : `Top Up ₦${Number(formState.amount || 0).toLocaleString()}`}
                </button>
            </form>
        </div>
    );
}