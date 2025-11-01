import React, { useState, useEffect, useCallback } from 'react';
import styles from './Dashboard.module.css';
import { useBalance } from '../Balance/BalanceContext.jsx';
import { useHistory } from '../History/HistoryContext.jsx';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const TV_PROVIDERS = [
    { id: 'dstv', name: 'DSTV' },
    { id: 'gotv', name: 'GOtv' },
    { id: 'startimes', name: 'StarTimes' },
];

const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN
// Mock validation and plan database
const SMARTCARD_DB = {
    '1234567890': {
        name: 'Babatunde Fashola',
        provider: 'dstv',
        plans: [
            { id: 'dstv-padi', name: 'DStv Padi', price: 2500 },
            { id: 'dstv-yanga', name: 'DStv Yanga', price: 3500 },
            { id: 'dstv-confam', name: 'DStv Confam', price: 6200 },
            { id: 'dstv-compact', name: 'DStv Compact', price: 10500 },
        ]
    },
    '0987654321': {
        name: 'Amina Yusuf',
        provider: 'gotv',
        plans: [
            { id: 'gotv-smallie', name: 'GOtv Smallie', price: 1100 },
            { id: 'gotv-jinja', name: 'GOtv Jinja', price: 2200 },
            { id: 'gotv-jolli', name: 'GOtv Jolli', price: 3300 },
            { id: 'gotv-max', name: 'GOtv Max', price: 4850 },
        ]
    },
    '2345678901': {
        name: 'Chioma Okoro',
        provider: 'startimes',
        plans: [
            { id: 'st-nova', name: 'Nova Bouquet', price: 900 },
            { id: 'st-basic', name: 'Basic Bouquet', price: 1700 },
            { id: 'st-classic', name: 'Classic Bouquet', price: 2500 },
        ]
    },
    '3456789012': {
        name: 'Musa Aliyu',
        provider: 'startimes',
        plans: [
            { id: 'st-nova', name: 'Nova Bouquet', price: 900 },
            { id: 'st-basic', name: 'Basic Bouquet', price: 1700 },
            { id: 'st-smart', name: 'Smart Bouquet', price: 2200 },
            { id: 'st-classic', name: 'Classic Bouquet', price: 2500 },
            { id: 'st-super', name: 'Super Bouquet', price: 4200 },
        ]
    }
};

export default function TvSubscriptionPopup({ onClose }) {
    const { balance: fiatBalance, deductBalance } = useBalance();
    const { addTransaction } = useHistory();
    const [client] = useState(getClient());
    const [accountId] = useState(getAccountId());

    const [formState, setFormState] = useState({ provider: '', smartCard: '', selectedPlan: null });
    const [customer, setCustomer] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('fiat');
    const [isProcessing, setIsProcessing] = useState(false);

    const validateSmartCard = useCallback(async (provider, smartCard) => {
        if (!provider || smartCard.length < 10) return;
        setIsValidating(true);
        setCustomer(null);
        setValidationError('');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        const customerData = SMARTCARD_DB[smartCard];
        if (customerData && customerData.provider === provider) {
            setCustomer(customerData);
        } else {
            setValidationError('Invalid Smart Card number for this provider.');
        }
        setIsValidating(false);
    }, []);

    useEffect(() => {
        validateSmartCard(formState.provider, formState.smartCard);
    }, [formState.provider, formState.smartCard, validateSmartCard]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value, selectedPlan: null })); // Reset plan on change
        setCustomer(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        if (!formState.selectedPlan) {
            setValidationError('Please select a subscription plan.');
            return;
        }

        setIsProcessing(true);
        const purchaseAmount = formState.selectedPlan.price;

        if (paymentMethod === 'fiat') {
            if (purchaseAmount > fiatBalance) {
                setValidationError('Insufficient Fiat (NGN) balance.');
                setIsProcessing(false);
                return;
            }
            setTimeout(() => {
                deductBalance(purchaseAmount);
                addTransaction({
                    type: 'TV Subscription',
                    note: `${formState.provider} ${formState.selectedPlan.name}`,
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
                    .setTransactionMemo(`TV: ${formState.provider} ${formState.selectedPlan.name}`);

                const txResponse = await transaction.execute(client);
                const receipt = await txResponse.getReceipt(client);

                if (receipt.status.toString() !== 'SUCCESS') {
                    throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
                }

                addTransaction({
                    type: 'TV Subscription (HBAR)',
                    note: `${formState.provider} ${formState.selectedPlan.name}`,
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

    const hbarCost = formState.selectedPlan ? (formState.selectedPlan.price / MOCK_HBAR_TO_NGN_RATE).toFixed(4) : '0.00';

    return (
        <div className={styles.servicePopup} role="dialog" aria-modal="true">
            <div className={styles.popupHeader}>
                <div className={styles.popupTitle}>TV Subscription</div>
                <button className={styles.popupClose} onClick={onClose} disabled={isProcessing}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.serviceForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="provider">TV Provider</label>
                    <select id="provider" required value={formState.provider} onChange={handleInputChange}>
                        <option value="">Select Provider</option>
                        {TV_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="smartCard">Smart Card / IUC Number</label>
                    <input id="smartCard" type="text" placeholder="Enter card number" required value={formState.smartCard} onChange={handleInputChange} maxLength="10" />
                    {isValidating && <div className={styles.meterStatus}>Validating...</div>}
                    {customer && <div className={styles.customerNameDisplay}>✓ {customer.name}</div>}
                    {validationError && <div className={styles.meterError}>{validationError}</div>}
                </div>
                {customer && (
                    <div className={styles.formGroup}>
                        <label>Select Plan</label>
                        <div className={styles.dataPlanGrid}>
                            {customer.plans.map(plan => (
                                <button key={plan.id} type="button" className={`${styles.dataPlanBtn} ${formState.selectedPlan?.id === plan.id ? styles.activePlan : ''}`} onClick={() => setFormState(prev => ({ ...prev, selectedPlan: plan }))}>
                                    <span className={styles.planLabel}>{plan.name}</span>
                                    <span className={styles.planPrice}>₦{plan.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label>Pay with:</label>
                    <div className={styles.paymentMethodSelector}>
                        <label className={paymentMethod === 'fiat' ? styles.active : ''}><input type="radio" name="paymentMethod" value="fiat" checked={paymentMethod === 'fiat'} onChange={() => setPaymentMethod('fiat')} /> Fiat (NGN)</label>
                        <label className={paymentMethod === 'crypto' ? styles.active : ''}><input type="radio" name="paymentMethod" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} /> Crypto ({hbarCost} ℏ)</label>
                    </div>
                </div>

                {validationError && <p className={styles.pinError}>{validationError}</p>}

                <button type="submit" className={styles.formSubmitBtn} disabled={!formState.selectedPlan || isProcessing}>
                    {isProcessing ? 'Processing...' : `Subscribe for ₦${formState.selectedPlan ? formState.selectedPlan.price.toLocaleString() : '0'}`}
                </button>
            </form>
        </div>
    );
}