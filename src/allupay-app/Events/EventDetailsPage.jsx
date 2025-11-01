import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchEventById } from './api.js';
import styles from './Events.module.css';
import detailsStyles from './EventDetails.module.css';
import { useBalance } from '../Balance/BalanceContext.jsx';
import { useHistory } from '../History/HistoryContext.jsx';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN


export default function EventDetailsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { balance, deductBalance } = useBalance();
    const { addTransaction } = useHistory();
    
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('fiat');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [client] = useState(getClient());
    const [accountId] = useState(getAccountId());

    useEffect(() => {
        const loadEvent = async () => {
            const fetchedEvent = await fetchEventById(eventId);
            setEvent(fetchedEvent);
            setIsLoading(false);
        };
        loadEvent();
    }, [eventId]);

    if (!event) {
        return <div className={styles.page}><div className={styles.loading}>{isLoading ? 'Loading Event...' : 'Event not found.'}</div></div>;
    }

    const totalPrice = event.price * quantity;

    const handlePurchase = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        if (paymentMethod === 'fiat') {
            if (totalPrice > balance) {
                setError('Insufficient Fiat (NGN) balance.');
                setIsProcessing(false);
                return;
            }
            deductBalance(totalPrice);
            addTransaction({
                type: 'Event Ticket',
                amount: `₦${totalPrice.toLocaleString()}`,
                note: `${quantity}x ticket(s) for ${event.name}`,
            });
            setIsProcessing(false);
            const ticketId = `${event.id}-${Date.now()}`;
            navigate(`/events/ticket/${ticketId}`, { state: { event, quantity } });
        } else {
            const hbarAmount = totalPrice / MOCK_HBAR_TO_NGN_RATE;
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
                    .setTransactionMemo(`Event Ticket: ${event.name}`);

                const txResponse = await transaction.execute(client);
                const receipt = await txResponse.getReceipt(client);

                if (receipt.status.toString() !== 'SUCCESS') {
                    throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
                }

                addTransaction({
                    type: 'Event Ticket (HBAR)',
                    note: `${quantity}x ticket(s) for ${event.name}`,
                    amount: `- ${hbarAmount.toFixed(4)} ℏ`,
                    transactionId: txResponse.transactionId,
                });
                
                setIsProcessing(false);
                const ticketId = `${event.id}-${Date.now()}`;
                navigate(`/events/ticket/${ticketId}`, { state: { event, quantity } });

            } catch (err) {
                setError(err.message || 'An error occurred during HBAR payment.');
                setIsProcessing(false);
            }
        }
    };

    const hbarCost = (totalPrice / MOCK_HBAR_TO_NGN_RATE).toFixed(4);

    return (
        <>
            <div className={styles.page}>
                <header className={styles.header}>
                    <Link to="/events" className={styles.backButton}>← All Events</Link>
                    <h1 className={styles.title}>{event.name}</h1>
                </header>

                <main className={detailsStyles.detailsGrid}>
                    <div className={detailsStyles.imageContainer} style={{ backgroundImage: `url(${event.image})` }} />
                    <div className={detailsStyles.infoContainer}>
                        <p className={detailsStyles.dateVenue}>{event.date} • {event.venue}</p>
                        <p className={detailsStyles.description}>{event.description}</p>

                        <form onSubmit={handlePurchase} className={detailsStyles.purchaseForm}>
                            <div className={detailsStyles.formGroup}>
                                <label htmlFor="quantity">Quantity</label>
                                <select id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                            </div>
                            <div className={detailsStyles.priceInfo}>
                                <p>Total Price</p>
                                <h2>{totalPrice > 0 ? `₦${totalPrice.toLocaleString()}` : 'Free'}</h2>
                            </div>
                            <div className={`${detailsStyles.formGroup} ${detailsStyles.fullWidth}`}>
                                <label>Pay with:</label>
                                <div className={detailsStyles.paymentMethodSelector}>
                                    <label className={paymentMethod === 'fiat' ? detailsStyles.active : ''}>
                                        <input type="radio" name="paymentMethod" value="fiat" checked={paymentMethod === 'fiat'} onChange={() => setPaymentMethod('fiat')} />
                                        Fiat (NGN)
                                    </label>
                                    <label className={paymentMethod === 'crypto' ? detailsStyles.active : ''}>
                                        <input type="radio" name="paymentMethod" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                                        Crypto ({hbarCost} ℏ)
                                    </label>
                                </div>
                            </div>
                            {error && <p className={detailsStyles.pinError}>{error}</p>}
                            <button type="submit" className={detailsStyles.purchaseButton} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Get Tickets'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}