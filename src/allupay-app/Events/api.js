// This file acts as a mock backend API.
// In a real application, these functions would make network requests to a server.

import evnt1 from '../../assets/evnt1.jfif';
import evnt2 from '../../assets/evnt2.jpg'; 
import evnt3 from '../../assets/evnt3.jpg'; 
import evnt4 from '../../assets/evnt4.jpg'; 
import evnt5 from '../../assets/evnt5_.jpg'; 
import evnt6 from '../../assets/evnt6.jpg'; 
import evnt7 from '../../assets/evnt7.jpg'; 
import evnt8 from '../../assets/evnt8.jpg'; 
import evnt9 from '../../assets/evnt9.webp'; 
import evnt10 from '../../assets/evnt10.jpg'; 
import evnt11 from '../../assets/evnt11.jfif'; 
import evnt12 from '../../assets/evnt12_.jfif'; 
import evnt13 from '../../assets/evnt13.jfif'; 

const MOCK_EVENTS = [
    // Upcoming
    { id: 1, name: 'Burna Boy Live in Concert', date: 'Dec 25, 2024', price: 15000, image: evnt2, venue: 'Eko Atlantic, Lagos', description: 'Experience the African Giant live on stage in his end-of-year homecoming concert.' },
    { id: 2, name: 'Lagos Food Festival', date: 'Nov 10, 2024', price: 5000, image: evnt3, venue: 'Tafawa Balewa Square', description: 'A celebration of Nigerian and international cuisine from the best chefs and vendors in Lagos.' },
    { id: 3, name: 'Web3 Lagos Conference', date: 'Jan 15, 2025', price: 25000, image: evnt4, venue: 'Landmark Centre, VI', description: 'Join industry leaders and innovators to discuss the future of decentralized technology in Africa.', externalUrl: 'https://event.web3bridge.com/' },
    { id: 4, name: 'AfroFuture Art Expo', date: 'Feb 20, 2025', price: 0, image: evnt5, venue: 'National Theatre, Iganmu', description: 'Discover contemporary and traditional art from Nigeria\'s most talented digital and physical artists. Free entry.' },
    { id: 5, name: 'Davido Timeless Tour', date: 'Dec 30, 2024', price: 20000, image: evnt6, venue: 'The O2, London', description: 'The global superstar brings his electrifying Timeless tour to London for one night only.', externalUrl: 'https://www.theo2.co.uk/events' },
    { id: 6, name: 'ART X Lagos', date: 'NOV 9, 2025', price: 0, image: evnt7, venue: 'Federal Palace Hotel, VI', description: 'West Africa’s leading international art fair' },
    { id: 7, name: 'Asake: Lungu Boy Tour', date: 'Nov 18, 2024', price: 18000, image: evnt8, venue: 'Barclays Center, New York', description: 'Mr. Money with the Vibe takes over New York with his unique blend of Afrobeats and Fuji.', externalUrl: 'https://www.ticketmaster.com/asake-tickets/artist/2912969' },
    { id: 12, name: 'Wizkid: More Love, Less Ego', date: 'Nov 29, 2024', price: 22000, image: evnt9, venue: 'The O2, London', description: 'The Starboy returns to London for his highly anticipated "More Love, Less Ego" tour. A night of pure vibes.', externalUrl: 'https://www.theo2.co.uk/events/detail/wizkid' },
    { id: 13, name: 'Tiwa Savage: Water & Garri', date: 'Oct 15, 2024', price: 19500, image: evnt10, venue: 'The O2, London', description: 'The Queen of Afrobeats, brings her critically acclaimed "Water & Garri" show to the iconic O2 arena.', externalUrl: 'https://www.theo2.co.uk/events/detail/tiwa-savage' },
    
    // Current
    { id: 8, name: 'Rema: Rave & Roses', date: 'Every Friday', price: 1000, image: evnt1, venue: 'New Afrika Shrine, Ikeja', description: 'The prince of Afrobeats brings his otherworldly sound to a weekly residency at the Shrine.' },
    
    // Past
    { id: 9, name: 'Onchain Festival 2025', date: 'OCT 30, 2025', price: 15000, image: evnt11 , venue: 'The Dome Freedom Way Eti-Osa, Lekki Phase 1, Lagos Lagos, LA 106104', description: 'Africa\'s largest creative convergence for Blockchain and Artificial Intelligence.' },
    { id: 10, name: 'Men In DeFi Campus Meetup', date: 'Nov 29, 2025', price: 0, image: evnt12, venue: 'FUOYE , Ekiti', description: 'A global non-profit organization dedicated to building men who will grow and thrive in the blockchain space.' },
    { id: 11, name: 'Blockfest Africa 2025', date: 'OCT 11, 2025', price: 0, image: evnt13, venue: 'The Muson Centre, Lagos', description: 'A premier event exploring the intersection of blockchain, cryptocurrency, and African innovation.', externalUrl: 'https://blockfest.africa/' },
];

export const fetchEvents = () => {
    console.log('Fetching all events...');
    return new Promise(resolve => {
        // Simulate network delay
        setTimeout(() => resolve(MOCK_EVENTS), 1000);
    });
};

export const fetchEventById = (id) => {
    console.log(`Fetching event with id: ${id}`);
    return new Promise(resolve => {
        // Simulate network delay
        setTimeout(() => {
            const event = MOCK_EVENTS.find(e => e.id === parseInt(id));
            resolve(event);
        }, 500);
    });
};