import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import ticketStyles from '../Events/Ticket.module.css';
import styles from './FlightTicket.module.css';

export default function FlightTicketPage() {
    const { state } = useLocation();
    const { ticketId } = useParams();
    const { bookingDetails, totalPrice } = state || {};

    if (!bookingDetails) {
        return (
            <div className={sharedStyles.page}>
                <div className={sharedStyles.loading}>
                    Invalid ticket details. Please check your <Link to="/dashboard">dashboard</Link> for your bookings.
                </div>
            </div>
        );
    }

    const { flight, passengers } = bookingDetails;
    const totalPassengers = passengers.adults + passengers.children + passengers.infants;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        `Flight Ticket: ${ticketId}\nFrom: ${flight.from.city}\nTo: ${flight.to.city}\nAirline: ${flight.airline}`
    )}`;

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: 'My Flight Ticket',
            text: `Check out my flight from ${flight.from.city} to ${flight.to.city} on ${flight.airline}!`,
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
                <Link to="/flights" className={sharedStyles.backButton}>← Book Another Flight</Link>
            </header>
            <div className={ticketStyles.wrapper}>
                <div className={ticketStyles.ticket}>
                    <div className={ticketStyles.ticketMain}>
                        <div className={ticketStyles.successMessage}>
                            <span className={ticketStyles.checkIcon}>✓</span>
                            Booking Confirmed!
                        </div>
                        <p className={ticketStyles.subtitle}>Your flight ticket is ready.</p>
                        <div className={ticketStyles.qrCode}>
                            <img src={qrCodeUrl} alt="Flight QR Code" />
                        </div>
                    </div>
                    <div className={ticketStyles.ticketStub}>
                        <h3 className={styles.flightRoute}>{flight.from.city} → {flight.to.city}</h3>
                        <p className={ticketStyles.eventMeta}>
                            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; {flight.airline}
                        </p>

                        <div className={styles.flightTimes}>
                            <div>
                                <span>Departure</span>
                                <p>{flight.departure}</p>
                            </div>
                            <div className={styles.flightLine}>
                                <span>{flight.duration}</span>
                                <div />
                                <span>✈</span>
                            </div>
                            <div>
                                <span>Arrival</span>
                                <p>{flight.arrival}</p>
                            </div>
                        </div>

                        <div className={ticketStyles.quantity}>
                            <span>Passengers</span>
                            <span>{totalPassengers}</span>
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