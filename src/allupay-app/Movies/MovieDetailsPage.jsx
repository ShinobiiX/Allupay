import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import styles from './MovieDetails.module.css';
import detailsStyles from '../Events/EventDetails.module.css'; // Re-using styles
import { fetchMovieDetails, getImageUrl } from './movie-api.js';
import { useBalance } from '../Balance/BalanceContext';
import { useHistory } from '../History/HistoryContext';
import { getClient, getAccountId } from '../Hedera/client';
import { Hbar, TransferTransaction } from '@hashgraph/sdk';

const MOCK_HBAR_TO_NGN_RATE = 120; // Assume 1 HBAR = 120 NGN
const TICKET_PRICE = 5000; // Mock price for demo

export default function MovieDetailsPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { balance, deductBalance } = useBalance();
    const { addTransaction } = useHistory();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('fiat');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [client] = useState(getClient());
    const [accountId] = useState(getAccountId());

    useEffect(() => {
        const loadDetails = async () => {
            setIsLoading(true);
            const details = await fetchMovieDetails(movieId);
            setMovie(details);
            setIsLoading(false);
        };
        loadDetails();
    }, [movieId]);

    const handlePurchase = async (e) => {
        e.preventDefault();
        setError('');
        const totalPrice = TICKET_PRICE * quantity;

        if (totalPrice > balance) {
            setError('Insufficient Fiat (NGN) balance.');
            return;
        }

        setIsProcessing(true);

        if (paymentMethod === 'fiat') {
            deductBalance(totalPrice);
            addTransaction({
                type: 'Movie Ticket',
                amount: `₦${totalPrice.toLocaleString()}`,
                note: `${quantity}x ticket(s) for ${movie.title}`,
            });
            setIsProcessing(false);
            const ticketId = `MOV-${movie.id}-${Date.now()}`;
            navigate(`/movies/ticket/${ticketId}`, { state: { movie, quantity } });
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
                    .setTransactionMemo(`Movie Ticket: ${movie.title}`);

                const txResponse = await transaction.execute(client);
                const receipt = await txResponse.getReceipt(client);

                if (receipt.status.toString() !== 'SUCCESS') {
                    throw new Error(`HBAR transfer failed with status: ${receipt.status.toString()}`);
                }

                addTransaction({
                    type: 'Movie Ticket (HBAR)',
                    note: `${quantity}x ticket(s) for ${movie.title}`,
                    amount: `- ${hbarAmount.toFixed(4)} ℏ`,
                    transactionId: txResponse.transactionId,
                });
                
                setIsProcessing(false);
                const ticketId = `MOV-${movie.id}-${Date.now()}`;
                navigate(`/movies/ticket/${ticketId}`, { state: { movie, quantity } });

            } catch (err) {
                setError(err.message || 'An error occurred during HBAR payment.');
                setIsProcessing(false);
            }
        }
    };

    if (isLoading) {
        return <div className={sharedStyles.page}><div className={sharedStyles.loading}>Loading Details...</div></div>;
    }

    if (!movie) {
        return (
            <div className={sharedStyles.page}>
                <div className={sharedStyles.loading}>
                    Movie not found. <Link to="/movies">Go back</Link>.
                </div>
            </div>
        );
    }

    const trailer = movie.videos?.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    // Mock price for demo
    const totalPrice = TICKET_PRICE * quantity;
    const hbarCost = (totalPrice / MOCK_HBAR_TO_NGN_RATE).toFixed(4);

    return (
        <>
            <div className={sharedStyles.page} style={{ padding: 0 }}>
            <div className={styles.heroSection} style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }}>
                <div className={styles.heroOverlay} />
                <div className={styles.header}>
                    <Link to="/movies" className={sharedStyles.backButton}>← All Movies</Link>
                </div>
                <div className={styles.heroContent}>
                    <img src={getImageUrl(movie.poster_path)} alt={movie.title} className={styles.poster} />
                    <div className={styles.info}>
                        <h1 className={styles.title}>{movie.title}</h1>
                        <div className={styles.meta}>
                            <span>{movie.release_date?.split('-')[0]}</span>
                            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <div className={styles.genres}>
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className={styles.genreTag}>{genre.name}</span>
                            ))}
                        </div>
                        <p className={styles.overview}>{movie.overview}</p>
                        <div className={detailsStyles.purchaseForm} style={{ background: 'none', padding: 0, border: 'none' }}>
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
                        </div>
                        <div className={detailsStyles.formGroup} style={{marginTop: '16px'}}>
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
                            {error && <p className={detailsStyles.pinError} style={{textAlign: 'left', marginTop: '8px'}}>{error}</p>}
                        </div>
                        <div className={styles.actionButtons} style={{ marginTop: '24px' }}>
                           {trailer && (
                               <a
                                   href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className={styles.trailerButton}
                               >
                                   Watch Trailer
                               </a>
                           )}
                           <button onClick={handlePurchase} className={styles.buyButton} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Buy Tickets'}
                           </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.detailsContent}>
                {movie.credits?.cast?.length > 0 && (
                    <section className={styles.castSection}>
                        <h2 className={sharedStyles.sectionTitle}>Top Cast</h2>
                        <div className={styles.castGrid}>
                            {movie.credits.cast.map(actor => (
                                <div key={actor.id} className={styles.castMember}>
                                    {/* <img src={getImageUrl(actor.profile_path)} alt={actor.name} className={styles.castAvatar} /> */}
                                    <p className={styles.castName}>{actor.name}</p>
                                    <p className={styles.castCharacter}>{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            </div>

        </>
    );
}