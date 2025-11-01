import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import styles from './Food.module.css';
import { fetchRestaurants } from './food-api';

const RestaurantCard = ({ restaurant }) => (
    <Link to={`/food/${restaurant.id}`} className={styles.restaurantCard}>
        <div className={styles.cardImage} style={{ backgroundImage: `url(${restaurant.image})` }}>
            <div className={styles.deliveryTime}>{restaurant.deliveryTime}</div>
        </div>
        <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
                <h3 className={styles.restaurantName}>{restaurant.name}</h3>
                <div className={styles.rating}>⭐ {restaurant.rating}</div>
            </div>
            <div className={styles.cardFooter}>
                <span>{restaurant.cuisine}</span>
                <span>{restaurant.priceRange}</span>
            </div>
        </div>
    </Link>
);

export default function FoodPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            const fetchedRestaurants = await fetchRestaurants();
            setRestaurants(fetchedRestaurants);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const categories = ['All', ...new Set(restaurants.map(r => r.cuisine))];

    const filteredRestaurants = restaurants
        .filter(r => selectedCategory === 'All' || r.cuisine === selectedCategory)
        .filter(r =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className={sharedStyles.page}>
            <header className={sharedStyles.header}>
                <Link to="/dashboard" className={sharedStyles.backButton}>← Back to Dashboard</Link>
                <h1 className={sharedStyles.title}>Order Food</h1>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Search for restaurants or cuisines..."
                        className={styles.searchBar}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.categoryFilters}>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className={sharedStyles.loading}>Loading Restaurants...</div>
                ) : (
                    <section>
                        <h2 className={sharedStyles.sectionTitle}>Popular Near You</h2>
                        <div className={styles.restaurantGrid}>
                            {filteredRestaurants.map(restaurant => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}