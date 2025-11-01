import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import sharedStyles from '../Events/Events.module.css';
import detailsStyles from '../Events/EventDetails.module.css';
import styles from './Cart.module.css';

export default function CartPage() {
    const { cartItems, updateQuantity, getTotalPrice } = useCart();
    const navigate = useNavigate();

    const [showPinPad, setShowPinPad] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');

    const totalPrice = getTotalPrice();

    const handlePurchase = (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        setShowPinPad(true);
    };

    const handlePinConfirm = () => {
        if (pin === '1234') {
            alert('Order placed successfully! (mock)');
            // In a real app, you'd clear the cart and navigate to an order confirmation page.
            setShowPinPad(false);
            navigate('/food');
        } else {
            setPinError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

    return (
        <>
            <div className={`${sharedStyles.page} ${showPinPad ? detailsStyles.blurred : ''}`}>
                <header className={sharedStyles.header}>
                    <Link to="/food" className={sharedStyles.backButton}>← Continue Shopping</Link>
                    <h1 className={sharedStyles.title}>Your Cart</h1>
                </header>

                <main className={styles.mainContent}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                        </div>
                    ) : (
                        <div className={styles.cartGrid}>
                            <div className={styles.cartItems}>
                                {cartItems.map(item => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                                        <div className={styles.itemDetails}>
                                            <h3>{item.name}</h3>
                                            <p>₦{item.price.toLocaleString()}</p>
                                        </div>
                                        <div className={styles.itemQuantity}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.orderSummary}>
                                <h2>Order Summary</h2>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Delivery Fee</span>
                                    <span>₦1,500</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                    <span>Total</span>
                                    <span>₦{(totalPrice + 1500).toLocaleString()}</span>
                                </div>
                                <button onClick={handlePurchase} className={detailsStyles.purchaseButton}>
                                    Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showPinPad && (
                <>
                    <div className={detailsStyles.popupOverlay} onClick={() => setShowPinPad(false)} />
                    <div className={detailsStyles.pinPopup}>
                        <div className={detailsStyles.popupTitle}>Enter Transaction PIN</div>
                        <p className={detailsStyles.pinSubtitle}>Confirm order for ₦{(totalPrice + 1500).toLocaleString()}</p>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => { setPin(e.target.value); setPinError(''); }}
                            maxLength="4"
                            autoFocus
                            className={detailsStyles.pinInput}
                            placeholder="----"
                        />
                        {pinError && <p className={detailsStyles.pinError}>{pinError}</p>}
                        <button onClick={handlePinConfirm} className={detailsStyles.purchaseButton}>
                            Confirm Order
                        </button>
                    </div>
                </>
            )}
        </>
    );
}