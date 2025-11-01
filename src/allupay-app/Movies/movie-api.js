// This file acts as a mock backend API for the movies feature.
// It simulates fetching data from an external source like TMDB.

import mov1 from '../../assets/mov1.webp';
import mov2 from '../../assets/mov2.webp';
import mov3 from '../../assets/mov3.webp';
import mov4 from '../../assets/mov4.jpg';
import mov5 from '../../assets/mov5.webp';
import mov6 from '../../assets/mov6.webp';
import mov7 from '../../assets/mov7.webp';
import mov8 from '../../assets/mov8.webp';
import mov9 from '../../assets/mov9.webp';
 

const MOCK_MOVIES = {
    now_playing: [
        { id: 1, title: 'Dune: Part Two', vote_average: 8.3, poster_path:mov1, backdrop_path: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.', trailer_key: 'Way9Dexny3w' },
        { id: 2, title: 'Godzilla x Kong: The New Empire', vote_average: 7.2, poster_path:mov2, backdrop_path: 'https://image.tmdb.org/t/p/original/j3Z3XktmWB1VhsS8iXNcrR86PXi.jpg', overview: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.', trailer_key: 'lV1OOlGwExM' },
        { id: 3, title: 'Kung Fu Panda 4', vote_average: 7.1, poster_path:mov3, backdrop_path: 'https://image.tmdb.org/t/p/original/kYgQzzjNis5jJalYtIHg2g4jr7Q.jpg', overview: 'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.', trailer_key: '_inKs4eeHiI' },
    ],
    popular: [
        { id: 4, title: 'The Fall Guy', vote_average: 7.4, poster_path: mov4 , backdrop_path: 'https://image.tmdb.org/t/p/original/H5HjE7Xb9N09rbWn1zBfxgI8uz.jpg', overview: 'A down-and-out stuntman must find the missing star of his ex-girlfriend\'s blockbuster film. (Refreshed)', trailer_key: 'j7jPnwVGdZ8' },
        { id: 5, title: 'Kingdom of the Planet of the Apes', vote_average: 7.2, poster_path:mov5 , backdrop_path: 'https://image.tmdb.org/t/p/original/fqv8v6AycXKsivp1T5yKtLbIceh.jpg', overview: 'Several generations in the future following Caesar\'s reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows.', trailer_key: 'XtFI7SNtVpYfor' },
        { id: 6, title: 'Inside Out 2', vote_average: 7.7, poster_path:mov6 , backdrop_path: 'https://image.tmdb.org/t/p/original/stfT3S2pSg8h3b4aGj4N9xQ3B2p.jpg', overview: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!', trailer_key: 'LEjhY15eCx0' },
    ],
    top_rated: [
        { id: 7, title: 'The Shawshank Redemption', vote_average: 8.7, poster_path:mov7 , backdrop_path: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', trailer_key: 'PLl99DlL6b4' },
        { id: 8, title: 'The Godfather', vote_average: 8.7, poster_path: mov8 , backdrop_path: 'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg', overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone, barely survives an attempt on his life, his  youngest son, Michael, steps in to take care of the would-be killers, launching a campaign of bloody revenge.', trailer_key: 'sY1S34973zA' },
        { id: 9, title: 'The Dark Knight', vote_average: 8.5, poster_path: mov9 , backdrop_path: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tGHRQSqLSfrkvQnA.jpg', overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.', trailer_key: 'EXeTwQWrcwY' },
    ]
};

const ALL_MOVIES = [
    ...MOCK_MOVIES.now_playing,
    ...MOCK_MOVIES.popular,
    ...MOCK_MOVIES.top_rated,
];

export const fetchMovies = (category = 'popular') => {
    return new Promise(resolve => {
        setTimeout(() => resolve(MOCK_MOVIES[category] || []), 500);
    });
};

export const fetchMovieDetails = (movieId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const movie = ALL_MOVIES.find(m => m.id === parseInt(movieId));
            // Add mock video, genre, and cast data for a richer details page
            const movieWithDetails = movie ? {
                ...movie,
                videos: { results: [{ key: movie.trailer_key || '_inKs4eeHiI', site: 'YouTube', type: 'Trailer' }] },
                release_date: '2024-05-23', // Example release date
                genres: [{id: 28, name: 'Action'}, {id: 878, name: 'Sci-Fi'}, {id: 12, name: 'Adventure'}],
                credits: {
                    cast: [
                        { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: 'https://image.tmdb.org/t/p/w185/z3sK2z6i7gV1b3T4i23v5i2wXG.jpg' },
                        { id: 2, name: 'Zendaya', character: 'Chani', profile_path: 'https://image.tmdb.org/t/p/w185/jHW421Q1pD2SgK1Nq7sD3s2w2v.jpg' },
                        { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://image.tmdb.org/t/p/w185/lJlo26G6g9K2tTgV2i5s5b5s8i.jpg' },
                        { id: 4, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: 'https://image.tmdb.org/t/p/w185/5s3sYUF2Q7n6d51b4G2p3a1j52f.jpg' },
                    ].slice(0, 4) // Show top 4 cast members
                }
            } : null;
            resolve(movieWithDetails);
        }, 300);
    });
};

export const searchMovies = (query) => {
    return new Promise(resolve => {
        const lowercasedQuery = query.toLowerCase();
        const results = ALL_MOVIES.filter(movie => 
            movie.title.toLowerCase().includes(lowercasedQuery)
        );
        setTimeout(() => resolve(results), 300);
    });
};

export const getImageUrl = (path) => {
    // With mock data, the path is the full URL
    return path;
};