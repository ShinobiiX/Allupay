import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Events.module.css';
import { ExternalLinkIcon } from '../Dashboard/icons.jsx';
import { fetchEvents } from './api.js';

const EventCardContent = ({ event }) => (
    <>
        {event.externalUrl && (
            <div className={styles.externalBadge}>
                <ExternalLinkIcon />
                <span>Official Site</span>
            </div>
        )}
        <div className={styles.eventInfo}>
            <h3 className={styles.eventName}>{event.name}</h3>
            <div className={styles.eventMeta}>
                <p className={styles.eventDate}>{event.date}</p>
                <p className={styles.eventPrice}>{event.price > 0 ? `₦${event.price.toLocaleString()}` : 'Free'}</p>
            </div>
        </div>
    </>
);

const EventGrid = ({ events }) => {
    return (
        <div className={styles.eventGrid}>
            {events.map(event => {;
                const cardProps = { className: styles.eventCard, style: { backgroundImage: `url(${event.image})` } }
                if (event.externalUrl) {
                    return <a key={event.id} href={event.externalUrl} target="_blank" rel="noopener noreferrer" {...cardProps}><EventCardContent event={event} /></a>;
                }
                return <Link key={event.id} to={`/events/${event.id}`} {...cardProps}><EventCardContent event={event} /></Link>;
            })}
        </div>
    );
};

export default function EventsPage() {
    const [allEvents, setAllEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            const events = await fetchEvents();
            setAllEvents(events);
            setIsLoading(false);
        };
        loadEvents();
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize for accurate date comparison

    const upcomingEvents = allEvents.filter(event => !event.date.includes('Every') && new Date(event.date) >= today);
    const currentEvents = allEvents.filter(event => event.date.includes('Every'));
    const pastEvents = allEvents.filter(event => !event.date.includes('Every') && new Date(event.date) < today);

    if (isLoading) {
        return <div className={styles.page}><div className={styles.loading}>Loading Events...</div></div>;
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <h1 className={styles.title}>Event Tickets</h1>
                </div>
                <div className={styles.headerActions}>
                    <Link to="/dashboard" className={styles.backButton}>← Back to Dashboard</Link>
                </div>
            </header>

            <main className={styles.mainContent}>
                {currentEvents.length > 0 && (
                    <section className={styles.eventCategory}>
                        <h2 className={styles.sectionTitle}>Current Events</h2>
                        <EventGrid events={currentEvents} />
                    </section>
                )}
                {upcomingEvents.length > 0 && (
                    <section className={styles.eventCategory}>
                        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
                        <EventGrid events={upcomingEvents} />
                    </section>
                )}
                {pastEvents.length > 0 && (
                    <section className={styles.eventCategory}>
                        <h2 className={styles.sectionTitle}>Past Events</h2>
                        <EventGrid events={pastEvents} />
                    </section>
                )}
            </main>
        </div>
    );
}