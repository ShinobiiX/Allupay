import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Flights.module.css';
import detailsStyles from '../Events/EventDetails.module.css'; // Reusing popup styles
import { useBalance } from '../Balance/BalanceContext.jsx';
import { useHistory } from '../History/HistoryContext.jsx';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN


export default function FlightBookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // Correctly destructure the flight object from the bookingDetails
    const { bookingDetails } = location.state || {};
    const { flight, passengers: initialPassengers } = bookingDetails || {};

    const { balance: fiatBalance, deductBalance } = useBalance();
    const { addTransaction } = useHistory();

    const [passengers] = useState(initialPassengers?.adults + initialPassengers?.children || 1);
    const [paymentMethod, setPaymentMethod] = useState('fiat');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [client] = useState(getClient());
    const [accountId] = useState(getAccountId());

    if (!flight) {
        // Handle case where user navigates directly to this page
        return (
            <div className={styles.page}>
                <h2>No flight selected</h2>
                <button onClick={() => navigate('/flights')} className={styles.primaryBtn}>Go back to flights</button>
            </div>
        );
    }

    const totalPrice = flight.price * (initialPassengers?.adults + initialPassengers?.children || 1);

    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        if (paymentMethod === 'fiat') {
            if (totalPrice > fiatBalance) {
                setError('Insufficient Fiat (NGN) balance.');
                setIsProcessing(false);
                return;
            }
            deductBalance(totalPrice);
            addTransaction({
                type: 'Flight Booking',
                amount: `₦${totalPrice.toLocaleString()}`,
                note: `${totalPrice / flight.price}x ticket(s) for ${flight.airline} to ${flight.to.code}`,
            });
            setIsProcessing(false);
            const ticketId = `${flight.id}-${Date.now()}`;
            navigate(`/flights/ticket/${ticketId}`, { state: { bookingDetails: { flight, passengers: { adults: passengers, children: 0, infants: 0 } } } });
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
                    .setTransactionMemo('Flight Booking Payment');

                const txResponse = await transaction.execute(client);
                const receipt = await txResponse.getReceipt(client);

                if (receipt.status.toString() !== 'SUCCESS') {
                    throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
                }

                addTransaction({
                    type: 'Flight Booking (HBAR)',
                    note: `${totalPrice / flight.price}x ticket(s) for ${flight.airline} to ${flight.to.code}`,
                    amount: `- ${hbarAmount.toFixed(4)} ℏ`,
                    transactionId: txResponse.transactionId,
                });
                
                setIsProcessing(false);
                const ticketId = `${flight.id}-${Date.now()}`;
                navigate(`/flights/ticket/${ticketId}`, { state: { bookingDetails: { flight, passengers: { adults: passengers, children: 0, infants: 0 } } } });

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
                    <button onClick={() => navigate('/flights')} className={styles.backButton}>← All Flights</button>
                    <h1 className={styles.title}>Confirm Booking</h1>
                </header>

                <main className={styles.bookingContainer}>
                    <div className={styles.flightSummary}>
                        <h2>{flight.airline}</h2>
                        <p>{flight.from.code} → {flight.to.code}</p>
                        <p>Date: {flight.date}</p>
                        <p>Price per passenger: ₦{flight.price.toLocaleString()}</p>
                    </div>

                    <form onSubmit={handleBooking} className={styles.bookingForm}>
                        <div className={detailsStyles.formGroup}>
                            <label htmlFor="passengers">Passengers</label>
                            <select id="passengers" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))} disabled>
                                {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className={detailsStyles.priceInfo}>
                            <p>Total Price</p>
                            <h2>₦{totalPrice.toLocaleString()}</h2>
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
                            {isProcessing ? 'Processing...' : 'Book Flight'}
                        </button>
                    </form>
                </main>
            </div>
        </>
    );
}