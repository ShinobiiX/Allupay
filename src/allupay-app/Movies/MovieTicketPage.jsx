import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import ticketStyles from '../Events/Ticket.module.css'; // Re-using event ticket styles

export default function MovieTicketPage() {
    const { state } = useLocation();
    const { ticketId } = useParams();
    const { movie, quantity } = state || {};

    if (!movie) {
        return (
            <div className={sharedStyles.page}>
                <div className={sharedStyles.loading}>
                    Invalid ticket details. Please check your <Link to="/dashboard">dashboard</Link> for your bookings.
                </div>
            </div>
        );
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        `Movie Ticket: ${ticketId}\nMovie: ${movie.title}\nQuantity: ${quantity}`
    )}`;

    const handlePrint = () => window.print();

    const handleShare = async () => {
        const shareData = {
            title: `My ticket for ${movie.title}`,
            text: `I just got my ticket for ${movie.title} on Allupay!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert('Share not supported on this browser. You can copy the link manually.');
            }
        } catch (err) {
            console.error('Error sharing ticket:', err);
        }
    };

    return (
        <div className={sharedStyles.page}>
            <header className={sharedStyles.header}>
                <Link to="/movies" className={sharedStyles.backButton}>← Back to Movies</Link>
            </header>
            <div className={ticketStyles.wrapper}>
                <div className={ticketStyles.ticket}>
                    <div className={ticketStyles.ticketMain}>
                        <div className={ticketStyles.successMessage}>
                            <span className={ticketStyles.checkIcon}>✓</span>
                            Purchase Confirmed!
                        </div>
                        <p className={ticketStyles.subtitle}>Your movie ticket is ready.</p>
                        <div className={ticketStyles.qrCode}>
                            <img src={qrCodeUrl} alt="Movie Ticket QR Code" />
                        </div>
                    </div>
                    <div className={ticketStyles.ticketStub}>
                        <h3 className={ticketStyles.eventName}>{movie.title}</h3>
                        <p className={ticketStyles.eventMeta}>
                            Enjoy the show!
                        </p>
                        <div className={ticketStyles.quantity}>
                            <span>Tickets</span>
                            <span>{quantity}</span>
                        </div>
                        <div className={ticketStyles.ticketId}>
                            <span>Ticket ID</span>
                            <span>{ticketId.slice(0, 18)}...</span>
                        </div>
                    </div>
                </div>
                <div className={ticketStyles.actions}>
                    <button onClick={handlePrint}>Print Ticket</button>
                    <button onClick={handleShare}>Share Ticket</button>
                </div>
            </div>
        </div>
    );
}