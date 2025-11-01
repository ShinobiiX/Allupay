import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import detailsStyles from '../Events/EventDetails.module.css';
import styles from './Bank.module.css';
import { useHistory } from '../History/HistoryContext';
import { COUNTRIES_AND_BANKS } from './bank-data.js';
import Spinner from '../common/Spinner.jsx';
import { useBalance } from '../Balance/BalanceContext.jsx';

const CURRENCIES = {
    NGN: { name: 'Nigerian Naira', symbol: '₦', rate: 1 },
    GHS: { name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 0.088 },
    XOF: { name: 'CFA Franc BCEAO', symbol: 'CFA', rate: 0.41 },
    KES: { name: 'Kenyan Shilling', symbol: 'KSh', rate: 0.092 },
    TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', rate: 1.74 },
    UGX: { name: 'Ugandan Shilling', symbol: 'USh', rate: 2.52 },
    RWF: { name: 'Rwandan Franc', symbol: 'FRw', rate: 0.88 },
    ETB: { name: 'Ethiopian Birr', symbol: 'Br', rate: 0.039 },
    ZAR: { name: 'South African Rand', symbol: 'R', rate: 0.012 },
    ZMW: { name: 'Zambian Kwacha', symbol: 'ZK', rate: 0.17 },
    ZWL: { name: 'Zimbabwean Dollar', symbol: 'Z$', rate: 0.0008 },
    AOA: { name: 'Angolan Kwanza', symbol: 'Kz', rate: 0.56 },
    CDF: { name: 'Congolese Franc', symbol: 'FC', rate: 1.88 },
};

export default function Bank() {
    const { addTransaction } = useHistory();
    const { balance, deductBalance } = useBalance();
    const navigate = useNavigate();

    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [amount, setAmount] = useState('');
    const [country, setCountry] = useState('NG');
    const [recipientName, setRecipientName] = useState('');
    const [narration, setNarration] = useState('');

    const [showPinPad, setShowPinPad] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');


    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');

    const selectedCountryData = COUNTRIES_AND_BANKS[country];
    const currency = selectedCountryData.currency;
    
    // New: Calculate the cost in NGN based on the amount entered in the destination currency
    const ngnCost = (amount / (CURRENCIES[currency]?.rate || 1)) * CURRENCIES['NGN'].rate;

    // Convert the base NGN balance to the selected country's currency for display
    const targetCurrencyInfo = CURRENCIES[currency] || CURRENCIES['NGN'];
    const displayedBalance = balance * targetCurrencyInfo.rate;

    useEffect(() => {
        // Reset bank name when country changes
        setBankName('');
        setAccountNumber('');
        setRecipientName('');
        setVerificationMessage('');
    }, [country]);

    useEffect(() => {
        if (accountNumber.length >= 10) { // Standard 10-digit NUBAN
            setIsVerifying(true);
            setVerificationMessage('');
            setRecipientName('');
            setTimeout(() => {
                const foundName = selectedCountryData.mockAccounts?.[accountNumber];
                if (foundName) {
                    setRecipientName(foundName);
                } else {
                    setVerificationMessage('Account not found');
                }
                setIsVerifying(false);
            }, 1000);
        }
    }, [accountNumber, selectedCountryData]);

    const handleTransfer = (e) => {
        e.preventDefault();
        if (!accountNumber || !bankName || !amount || !recipientName) {
            alert('Please fill all required fields.');
            return;
        }
        if (ngnCost > balance) {
            alert('Insufficient balance for this transaction.');
            return;
        }
        setShowPinPad(true);
    };

    const handlePinConfirm = () => {
        if (pin === '1234') {
            addTransaction({
                type: 'Bank Transfer',
                amount: `${CURRENCIES[currency].symbol}${parseFloat(amount).toFixed(2)}`,
                note: `To: ${recipientName} (${bankName})`,
                currency: currency,
                filterCategory: 'Bank',
            });
            deductBalance(ngnCost);
            alert('Transfer Successful!');
            setShowPinPad(false);
            navigate('/dashboard');
        } else {
            setPinError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

  return (
    <>
        <div className={`${styles.send_main} ${showPinPad ? detailsStyles.blurred : ''}`}>
            <section className={styles.paymentMethods}>
                <button className={`${styles.methodBtn} ${styles.activeMethod}`}>Bank</button>
                <Link to="/momo" className={styles.methodBtn}>Momo</Link>
                <Link to="/cryptocurrency" className={styles.methodBtn}>Crypto</Link>
            </section>

            <main className={styles.container}>
                <section className={styles.card}>
                    <header className={styles.header}>
                        <div>
                            <h2 className={styles.title}>International Bank Transfer</h2>
                            <div className={styles.subtitle}>Send money across Africa</div>
                        </div>
                        <div className={styles.meta}>
                            <div className={styles.metaLabel}>Available Balance</div>
                            <div className={styles.metaValue}>{targetCurrencyInfo.symbol}{displayedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </header>

                    <form className={styles.sendForm} onSubmit={handleTransfer}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="country">Destination Country</label>
                            <select id="country" value={country} onChange={e => setCountry(e.target.value)}>
                                {Object.keys(COUNTRIES_AND_BANKS).map(code => (
                                    <option key={code} value={code}>{COUNTRIES_AND_BANKS[code].name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="bankName">Bank Name</label>
                            <select id="bankName" value={bankName} onChange={e => setBankName(e.target.value)} required>
                                <option value="" disabled>Select a bank</option>
                                {selectedCountryData.banks.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="accountNumber">Account Number</label>
                                <input id="accountNumber" type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="0123456789" required maxLength="10" />
                                {isVerifying && <div className={styles.verificationStatus}><Spinner /></div>}
                                {verificationMessage && <div className={`${styles.verificationStatus} ${styles.error}`}>{verificationMessage}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="recipientName">Recipient Name</label>
                                <input 
                                    id="recipientName" 
                                    type="text" value={recipientName} 
                                    onChange={e => setRecipientName(e.target.value)} 
                                    placeholder="Recipient name will appear here" 
                                    required />
                            </div>
                        </div>
                        <div className={styles.amountGroup}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="amount">Amount ({targetCurrencyInfo.name})</label>
                                <input id="amount" type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100.00" required />
                            </div>
                            <div className={styles.convertedAmount}>
                                ≈ {CURRENCIES['NGN'].symbol}{ngnCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="narration">Narration (Optional)</label>
                            <input id="narration" type="text" value={narration} onChange={e => setNarration(e.target.value)} placeholder="e.g., For groceries" />
                        </div>
                        <div className={styles.actions}>
                            <button type="submit" className={styles.primary}>Send Money</button>
                        </div>
                    </form>
                </section>

                <aside className={styles.sideCard}>
                    <div className={styles.sideHeader}>
                        <h3>Transfer Info</h3>
                        <div className={styles.tipSmall}>Mock environment</div>
                    </div>
                    <div className={styles.sideBody}>
                        <div className={styles.infoRow}>
                            <div className={styles.infoKey}>Processing</div>
                            <div className={styles.infoVal}>Instant (mock)</div>
                        </div>
                        <ul className={styles.tips}>
                            <li>Cross-border transfers are simulated.</li>
                            <li>Exchange rates are for demo purposes.</li>
                            <li>Always double-check recipient details.</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>

            {showPinPad && (
                <>
                    <div className={detailsStyles.popupOverlay} onClick={() => setShowPinPad(false)} />
                    <div className={detailsStyles.pinPopup}>
                        <div className={detailsStyles.popupTitle}>Enter PIN</div>
                        <p className={detailsStyles.pinSubtitle}>Confirm transfer of ≈ ₦{ngnCost.toLocaleString()}</p>
                        <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setPinError(''); }} maxLength="4" autoFocus className={detailsStyles.pinInput} placeholder="----" />
                        {pinError && <p className={detailsStyles.pinError}>{pinError}</p>}
                        <button onClick={handlePinConfirm} className={detailsStyles.purchaseButton}>Confirm Transfer</button>
                    </div>
                </>
            )}
    </>
  );
}