import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cryptocurrency.module.css';
import { useHistory } from '../History/HistoryContext';
import popupStyles from '../Events/EventDetails.module.css';
import { useBalance } from '../Balance/BalanceContext.jsx';
import { getClient, getAccountId } from '../Hedera/client.js';
import {
  Client,
  Hbar,
  TransferTransaction,
  AccountBalanceQuery
} from "@hashgraph/sdk";

const COINS = [
  { symbol: 'HBAR', name: 'Hedera', color: '#2ca58d', icon: 'H' },
];

export default function Cryptocurrency() {
  const MOCK_HBAR_TO_NGN_RATE = 120; // 1 HBAR = 120 NGN

  const { addTransaction } = useHistory();
  const { balance: fiatBalance, addBalance, deductBalance } = useBalance();
  const navigate = useNavigate();

  // Hedera-specific state
  const [hbarBalance, setHbarBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [client] = useState(getClient());
  const [accountId] = useState(getAccountId());

  // Form state
  const [activeCoin, setActiveCoin] = useState('HBAR');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('avg');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellAmount, setSellAmount] = useState('');
  const [isSelling, setIsSelling] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [isBuying, setIsBuying] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!client || !accountId) return;
    setIsLoadingBalance(true);
    try {
      const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
      const accountBalance = await balanceQuery.execute(client);
      setHbarBalance(accountBalance.hbars.toTinybars().toNumber() / 100_000_000);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setNotice("Could not fetch account balance.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [client, accountId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  function validate() {
    const a = Number(amount);
    // Updated Regex: Validate either Hedera Account ID (0.0.x) or EVM address (0x...)
    const isValidAddressFormat = /(^\d\.\d\.\d+$)|(^0x[a-fA-F0-9]{40}$)/.test(address.trim());

    if (!address.trim() || !isValidAddressFormat) {
      return 'Enter a valid Hedera Account ID (e.g., 0.0.12345) or EVM address (e.g., 0x...)';
    }
    if (!a || a <= 0) return 'Enter a valid amount';
    if (a > hbarBalance) return 'Insufficient HBAR balance';
    return null;
  }

  function handleSendClick(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setNotice(err);
      return;
    }
    setNotice('');
    setShowConfirmModal(true);
  }

  async function handleConfirmSend() {
    setNotice('');
    setBusy(true); // Set busy state here
    setShowConfirmModal(false);

    try {
      //Create the transfer transaction
      const transaction = new TransferTransaction()
        .addHbarTransfer(accountId, new Hbar(-amount))
        .addHbarTransfer(address, new Hbar(amount));

      //Sign with the client operator private key and submit to a Hedera network
      const txResponse = await transaction.execute(client);

      //Request the receipt of the transaction
      const receipt = await txResponse.getReceipt(client);

      //Get the transaction consensus status
      const transactionStatus = receipt.status;

      if (transactionStatus.toString() !== 'SUCCESS') {
        throw new Error(`Transaction failed with status: ${transactionStatus.toString()}`);
      }

      setNotice(`Successfully sent ${amount} HBAR!`);

      // Add to local history
      addTransaction({
        type: 'Crypto Send',
        coin: 'HBAR',
        amount: Number(amount).toFixed(8),
        filterCategory: 'Crypto',
        note: `Send ${amount} HBAR → ${address}`,
        counterparty: address,
      });

      // Refetch balance
      const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
      const accountBalance = await balanceQuery.execute(client);
      setHbarBalance(accountBalance.hbars.toTinybars().toNumber() / 100_000_000);

      // Clear form
      setAmount('');
      setAddress('');

    } catch (error) {
      console.error(error);
      setNotice(`Error: ${error.message}`);
    } finally {
      setBusy(false);
      setTimeout(() => setNotice(''), 5000);
    }
  }

  async function handleSell() {
    const amountToSell = Number(sellAmount);
    if (!amountToSell || amountToSell <= 0) {
      setNotice("Please enter a valid amount to sell.");
      return;
    }
    if (amountToSell > hbarBalance) {
      setNotice("Insufficient HBAR balance for this sale.");
      return;
    }

    const treasuryAccountId = import.meta.env.VITE_TREASURY_ACCOUNT_ID;
    if (!treasuryAccountId) {
      setNotice("Sell service is not configured. Please contact support.");
      return;
    }

    setIsSelling(true);
    setNotice('');

    try {
      const transaction = new TransferTransaction()
        .addHbarTransfer(accountId, new Hbar(-amountToSell))
        .addHbarTransfer(treasuryAccountId, new Hbar(amountToSell));

      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);

      if (receipt.status.toString() !== 'SUCCESS') {
        throw new Error(`On-chain sale failed with status: ${receipt.status.toString()}`);
      }

      // On-chain part is done, now update local fiat balance
      const ngnValue = amountToSell * MOCK_HBAR_TO_NGN_RATE;
      addBalance(ngnValue);

      addTransaction({
        type: 'Crypto Sale',
        amount: `+ ₦${ngnValue.toLocaleString()}`,
        note: `Sold ${amountToSell} HBAR`,
        filterCategory: 'Crypto',
        currency: 'NGN',
      });

      setNotice(`Successfully sold ${amountToSell} HBAR for ₦${ngnValue.toLocaleString()}!`);
      setShowSellModal(false);
      setSellAmount('');
      fetchBalance(); // Re-fetch HBAR balance

    } catch (error) {
      console.error(error);
      setNotice(`Error: ${error.message}`);
    } finally {
      setIsSelling(false);
    }
  }

  async function handleBuy() {
    const amountToBuy = Number(buyAmount);
    const ngnCost = amountToBuy * MOCK_HBAR_TO_NGN_RATE;

    if (!amountToBuy || amountToBuy <= 0) {
      setNotice("Please enter a valid amount to buy.");
      return;
    }
    if (ngnCost > fiatBalance) {
      setNotice("Insufficient NGN balance for this purchase.");
      return;
    }

    const treasuryAccountId = import.meta.env.VITE_TREASURY_ACCOUNT_ID;
    const treasuryPrivateKey = import.meta.env.VITE_TREASURY_PRIVATE_KEY;

    if (!treasuryAccountId || !treasuryPrivateKey) {
      setNotice("Purchase service is not configured. Please contact support.");
      return;
    }

    setIsBuying(true);
    setNotice('');

    try {
      // Create a temporary client for the treasury to sign the transaction
      const treasuryClient = Client.forTestnet();
      treasuryClient.setOperator(treasuryAccountId, treasuryPrivateKey);

      const transaction = new TransferTransaction()
        .addHbarTransfer(treasuryAccountId, new Hbar(-amountToBuy))
        .addHbarTransfer(accountId, new Hbar(amountToBuy))
        .freezeWith(treasuryClient); // Freeze with the treasury client

      const txResponse = await transaction.execute(treasuryClient);
      const receipt = await txResponse.getReceipt(treasuryClient);

      if (receipt.status.toString() !== 'SUCCESS') {
        throw new Error(`On-chain purchase failed with status: ${receipt.status.toString()}`);
      }

      // On-chain part is done, now update local balances
      deductBalance(ngnCost);
      addTransaction({
        type: 'Crypto Purchase',
        amount: `+ ${amountToBuy.toLocaleString()} HBAR`,
        note: `Cost: ₦${ngnCost.toLocaleString()}`,
        filterCategory: 'Crypto',
        currency: 'HBAR',
      });

      setNotice(`Successfully purchased ${amountToBuy} HBAR!`);
      setShowBuyModal(false);
      setBuyAmount('');
      fetchBalance(); // Re-fetch HBAR balance
    } catch (error) {
      console.error(error);
      setNotice(`Error: ${error.message}`);
    } finally {
      setIsBuying(false);
    }
  }

  const coin = COINS.find(c => c.symbol === activeCoin) || COINS[0];

  return (
    <>
      <div className={`${styles.send_main} ${showConfirmModal || showSellModal || showBuyModal ? popupStyles.blurred : ''}`}>
        <section className={styles.paymentMethods}>
          <Link to="/transfer" className={styles.methodBtn}>Bank</Link>
          <Link to="/momo" className={styles.methodBtn}>Momo</Link>
          <button className={`${styles.methodBtn} ${styles.activeMethod}`}>Crypto</button>
        </section>

        <main className={styles.container}>
          <aside className={styles.portfolioCard}>
            <div className={styles.portfolioHeader}>
              <h3>HBAR Balance</h3>
            </div>
            <div className={styles.hbarDisplay}>
              <div className={styles.hbarIcon}>H</div>
              <div className={styles.hbarBalanceInfo}>
                <div className={styles.hbarAmount}>
                  {isLoadingBalance ? 'Loading...' : `${hbarBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} HBAR`}
                </div>
                <div className={styles.hbarFiatValue}>≈ ₦{(hbarBalance * MOCK_HBAR_TO_NGN_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
            <div className={styles.fiatBalanceDisplay}>
              <h4>Available Fiat Balance</h4>
              <div>₦{fiatBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </aside>

          <section className={styles.card}>
            <form onSubmit={handleSendClick}>
              <div className={styles.cardHeader}>
                <div className={styles.coinTitle}>
                  <div className={styles.coinIconLarge} style={{ borderColor: coin.color }}>
                    <span style={{ color: coin.color, fontWeight: 800 }}>{coin.icon}</span>
                  </div>
                  <div>
                    <div className={styles.coinName}>{coin.name}</div>
                    <div className={styles.coinSub}>{coin.symbol}</div>
                  </div>
                </div>
                <div className={styles.coinBalance}>
                   Balance: {isLoadingBalance
                    ? 'Loading...'
                    : `${hbarBalance.toFixed(8)} ${activeCoin}`}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <label className={styles.label}>Recipient address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Hedera Account ID or 0x... address" />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Amount</label>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal" />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Network fee</label>
                  <div className={styles.feeRow}>
                    <select value={fee} onChange={(e) => setFee(e.target.value)} className={styles.feeSelect}>
                      <option value="avg">Average (auto)</option>
                    </select>
                    <div className={styles.estimated}>Estimated: <strong>≈ $0.0001</strong></div>
                  </div>
                </div>

                {notice && <div className={styles.notice}>{notice}</div>}
                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => setShowBuyModal(true)} disabled={busy}>Buy HBAR</button>
                  <button type="button" className={styles.secondary} onClick={() => setShowSellModal(true)} disabled={busy}>Sell HBAR</button>
                  <button type="submit" className={styles.primary} disabled={busy || activeCoin !== 'HBAR'}>{busy ? 'Sending…' : `Send ${activeCoin}`}</button>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>

      {showConfirmModal && (
        <>
          <div className={popupStyles.popupOverlay} onClick={() => setShowConfirmModal(false)} />
          <div className={popupStyles.pinPopup}>
            <div className={popupStyles.popupTitle}>Confirm Transfer</div>
            <p className={popupStyles.pinSubtitle}>
              You are about to send <strong style={{color: 'white'}}>{amount} HBAR</strong> to the address:
            </p>
            <p className={styles.confirmAddress}>{address}</p>
            <p className={popupStyles.pinSubtitle}>This action is irreversible.</p>
            <button onClick={handleConfirmSend} className={popupStyles.purchaseButton}>Confirm & Send</button>
          </div>
        </>
      )}

      {showSellModal && (
        <>
          <div className={popupStyles.popupOverlay} onClick={() => !isSelling && setShowSellModal(false)} />
          <div className={popupStyles.pinPopup}>
            <div className={popupStyles.popupHeader}>
              <div className={popupStyles.popupTitle}>Sell HBAR for Fiat</div>
              <button className={popupStyles.popupClose} onClick={() => !isSelling && setShowSellModal(false)}>&times;</button>
            </div>
            <p className={popupStyles.pinSubtitle}>Enter the amount of HBAR to sell to your NGN balance.</p>
            <div className={styles.field} style={{marginBottom: '16px'}}>
              <label className={styles.label}>Amount in HBAR</label>
              <input value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} placeholder="0.00" inputMode="decimal" autoFocus />
              <div className={styles.estimated} style={{textAlign: 'center', marginTop: '8px'}}>
                You will receive ≈ ₦{isNaN(parseFloat(sellAmount)) ? '0.00' : (parseFloat(sellAmount) * MOCK_HBAR_TO_NGN_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            {notice && <div className={styles.notice} style={{marginBottom: '16px'}}>{notice}</div>}
            <button onClick={handleSell} className={popupStyles.purchaseButton} disabled={isSelling}>
              {isSelling ? 'Selling...' : 'Sell HBAR'}
            </button>
          </div>
        </>
      )}

      {showBuyModal && (
        <>
          <div className={popupStyles.popupOverlay} onClick={() => !isBuying && setShowBuyModal(false)} />
          <div className={popupStyles.pinPopup}>
            <div className={popupStyles.popupHeader}>
              <div className={popupStyles.popupTitle}>Buy HBAR with Fiat</div>
              <button className={popupStyles.popupClose} onClick={() => !isBuying && setShowBuyModal(false)}>&times;</button>
            </div>
            <p className={popupStyles.pinSubtitle}>Enter the amount of HBAR to purchase from your NGN balance.</p>
            <div className={styles.field} style={{marginBottom: '16px'}}>
              <label className={styles.label}>Amount in HBAR</label>
              <input value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} placeholder="0.00" inputMode="decimal" autoFocus />
              <div className={styles.estimated} style={{textAlign: 'center', marginTop: '8px'}}>
                Cost: ≈ ₦{isNaN(parseFloat(buyAmount)) ? '0.00' : (parseFloat(buyAmount) * MOCK_HBAR_TO_NGN_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            {notice && <div className={styles.notice} style={{marginBottom: '16px'}}>{notice}</div>}
            <button onClick={handleBuy} className={popupStyles.purchaseButton} disabled={isBuying}>
              {isBuying ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </>
      )}
    </>
  );
}