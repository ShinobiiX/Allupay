import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import styles from './Movies.module.css';
import { fetchMovies, getImageUrl, searchMovies } from './movie-api';
import { ChevronLeftIcon, ChevronRightIcon } from '../Dashboard/icons.jsx';

const MovieCard = ({ movie }) => (
    <Link to={`/movies/${movie.id}`} className={styles.movieCard}>
        <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
        <div className={styles.cardOverlay}>
            <div className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</div>
            <h3 className={styles.movieTitle}>{movie.title}</h3>
        </div>
    </Link>
);

const MovieCarousel = ({ title, movies }) => {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.offsetWidth * 0.8;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className={styles.carouselSection}>
            <h2 className={sharedStyles.sectionTitle}>{title}</h2>
            <div className={styles.carouselContainer}>
                <button className={`${styles.scrollButton} ${styles.left}`} onClick={() => scroll('left')}><ChevronLeftIcon /></button>
                <div className={styles.carousel} ref={carouselRef}>
                    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
                <button className={`${styles.scrollButton} ${styles.right}`} onClick={() => scroll('right')}><ChevronRightIcon /></button>
            </div>
        </section>
    );
};

export default function MoviesPage() {
    const [heroMovie, setHeroMovie] = useState(null);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const loadMovies = async () => {
            setIsLoading(true);
            try {
                const [nowPlayingData, popularData, topRatedData] = await Promise.all([
                    fetchMovies('now_playing'),
                    fetchMovies('popular'),
                    fetchMovies('top_rated')
                ]);

                setHeroMovie(popularData[0] || null);
                setNowPlaying(nowPlayingData);
                setPopular(popularData);
                setTopRated(topRatedData);
            } catch (error) {
                console.error("Failed to load movie data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMovies();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const debounce = setTimeout(() => {
            searchMovies(searchTerm).then(results => {
                setSearchResults(results);
                setIsSearching(false);
            });
        }, 500); // Debounce to avoid too many requests

        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const showSearchResults = searchTerm.trim() !== '';

    if (isLoading) {
        return <div className={sharedStyles.page}><div className={sharedStyles.loading}>Loading Movies...</div></div>;
    }

    return (
        <div className={sharedStyles.page}>
            <header className={sharedStyles.header}>
                <Link to="/dashboard" className={sharedStyles.backButton}>← Back to Dashboard</Link>
                <h1 className={sharedStyles.title}>Movies</h1>
            </header>
            {heroMovie && (
                <header className={styles.heroSection} style={{ backgroundImage: `url(${getImageUrl(heroMovie.backdrop_path, 'original')})` }}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>{heroMovie.title}</h1>
                        <p className={styles.heroOverview}>{heroMovie.overview}</p>
                        <Link to={`/movies/${heroMovie.id}`} className={styles.heroButton}>
                            View Details
                        </Link>
                        <div className={styles.searchBarContainer}>
                            <input
                                type="text"
                                placeholder="Search for movies..."
                                className={styles.searchBar}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {showSearchResults && (
                                <button className={styles.clearSearchButton} onClick={() => setSearchTerm('')}>&times;</button>
                            )}
                        </div>
                    </div>
                </header>
            )}

            <main className={styles.mainContent}>
                {showSearchResults ? (
                    <section>
                        <h2 className={sharedStyles.sectionTitle}>Search Results for "{searchTerm}"</h2>
                        {isSearching ? (
                            <div className={sharedStyles.loading}>Searching...</div>
                        ) : searchResults.length > 0 ? (
                            <div className={styles.resultsGrid}>
                                {searchResults.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                            </div>
                        ) : (
                            <p>No movies found.</p>
                        )}
                    </section>
                ) : (
                    <>
                        {nowPlaying.length > 0 && <MovieCarousel title="Now Playing" movies={nowPlaying} />}
                        {popular.length > 0 && <MovieCarousel title="Popular" movies={popular} />}
                        {topRated.length > 0 && <MovieCarousel title="Top Rated" movies={topRated} />}
                    </>
                )}
            </main>
        </div>
    );
}
