import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styles from './Events.module.css';
import ticketStyles from './Ticket.module.css';

export default function TicketPage() {
    const { ticketId } = useParams();
    const location = useLocation();
    const { event, quantity } = location.state || {};

    if (!event) {
        return <div>Ticket details not found. <Link to="/events">Go back to events.</Link></div>;
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketId)}`;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/events" className={styles.backButton}>← All Events</Link>
                <h1 className={styles.title}>Your Ticket</h1>
            </header>

            <main className={ticketStyles.wrapper}>
                <div className={ticketStyles.ticket}>
                    <div className={ticketStyles.ticketMain}>
                        <div className={ticketStyles.successMessage}>
                            <span className={ticketStyles.checkIcon}>✓</span>
                            Purchase Successful!
                        </div>
                        <p className={ticketStyles.subtitle}>Present this QR code at the event entrance.</p>
                        <div className={ticketStyles.qrCode}>
                            <img src={qrCodeUrl} alt="Event Ticket QR Code" />
                        </div>
                    </div>
                    <div className={ticketStyles.ticketStub}>
                        <h2 className={ticketStyles.eventName}>{event.name}</h2>
                        <p className={ticketStyles.eventMeta}>{event.date} • {event.venue}</p>
                        <p className={ticketStyles.quantity}><span>Quantity</span>{quantity}</p>
                        <p className={ticketStyles.ticketId}><span>Ticket ID</span>{ticketId}</p>
                    </div>
                </div>

                <div className={ticketStyles.actions}>
                    <button onClick={() => alert('Feature coming soon!')}>Save to Wallet</button>
                    <button onClick={() => alert('Feature coming soon!')}>Download PDF</button>
                </div>
            </main>
        </div>
    );
}