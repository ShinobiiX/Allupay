import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import styles from './Restaurant.module.css';
import { fetchRestaurantById } from './food-api';
import { useCart } from './CartContext';

const MenuItem = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <div className={styles.menuItem}>
            <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <span className={styles.itemPrice}>₦{item.price.toLocaleString()}</span>
            </div>
            <div className={styles.itemActions}>
                {item.image && <img src={item.image} alt={item.name} className={styles.itemImage} />}
                <button className={styles.addToCartButton} onClick={() => addToCart(item)}>Add</button>
            </div>
        </div>
    );
};

export default function RestaurantPage() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRestaurant = async () => {
            const fetchedRestaurant = await fetchRestaurantById(restaurantId);
            setRestaurant(fetchedRestaurant);
            setIsLoading(false);
        };
        loadRestaurant();
    }, [restaurantId]);

    if (isLoading) {
        return <div className={sharedStyles.page}><div className={sharedStyles.loading}>Loading Restaurant...</div></div>;
    }

    if (!restaurant) {
        return (
            <div className={sharedStyles.page}>
                <div className={sharedStyles.loading}>
                    Restaurant not found. Please <Link to="/food">go back</Link>.
                </div>
            </div>
        );
    }

    return (
        <div className={sharedStyles.page}>
            <header className={sharedStyles.header}>
                <Link to="/food" className={sharedStyles.backButton}>← Back to Restaurants</Link>
                <h1 className={sharedStyles.title}>{restaurant.name}</h1>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.restaurantHeader}>
                    <div className={styles.restaurantImage} style={{ backgroundImage: `url(${restaurant.image})` }} />
                    <div className={styles.restaurantInfo}>
                        <h2 className={styles.restaurantName}>{restaurant.name}</h2>
                        <p className={styles.restaurantMeta}>{restaurant.cuisine} • {restaurant.deliveryTime} • ⭐ {restaurant.rating}</p>
                        <p className={styles.restaurantMeta}>{restaurant.priceRange}</p>
                    </div>
                </div>

                <section className={styles.menuSection}>
                    <h2 className={sharedStyles.sectionTitle}>Menu</h2>
                    <div className={styles.menuGrid}>
                        {restaurant.menu.map(item => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}