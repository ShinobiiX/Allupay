// This file acts as a mock backend API for the food ordering feature.

const MOCK_RESTAURANTS = [
    {
        id: 'chicken-republic',
        name: 'Chicken Republic',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Fast Food',
        rating: 4.2,
        deliveryTime: '25-35 min',
        priceRange: '₦₦',
        menu: [
            { id: 'cr-1', name: 'Refuel Max', description: '2 pieces of chicken, fried rice, and a drink.', price: 3500, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1974&auto=format&fit=crop' },
            { id: 'cr-2', name: 'Citizen Meal', description: '1 piece of chicken, jollof rice, and a side.', price: 2800, image: 'https://images.unsplash.com/photo-1565299585323-203692424482?q=80&w=1981&auto=format&fit=crop' },
            { id: 'cr-3', name: 'Chicken Salad', description: 'Grilled chicken strips on a bed of fresh greens.', price: 4200, image: 'https://images.unsplash.com/photo-1551248429-4573cf60b6a3?q=80&w=1887&auto=format&fit=crop' },
        ]
    },
    {
        id: 'the-place',
        name: 'The Place',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Nigerian',
        rating: 4.5,
        deliveryTime: '35-45 min',
        priceRange: '₦₦₦',
        menu: [
            { id: 'tp-1', name: 'Asun (Spicy Goat Meat)', description: 'Smoky and spicy grilled goat meat.', price: 5500, image: 'https://images.unsplash.com/photo-1604329263239-aa8ce2742452?q=80&w=2070&auto=format&fit=crop' },
            { id: 'tp-2', name: 'Jollof Rice with Plantain', description: 'Classic Nigerian party jollof with fried plantain.', price: 4000, image: 'https://images.unsplash.com/photo-1606787366850-de6330128214?q=80&w=2070&auto=format&fit=crop' },
            { id: 'tp-3', name: 'Efo Riro & Pounded Yam', description: 'Rich vegetable soup served with pounded yam.', price: 6000, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop' },
        ]
    },
    {
        id: 'pizza-jungle',
        name: 'Pizza Jungle',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Italian',
        rating: 4.0,
        deliveryTime: '40-50 min',
        priceRange: '₦₦₦',
        menu: [
            { id: 'pj-1', name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese.', price: 7500, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1935&auto=format&fit=crop' },
            { id: 'pj-2', name: 'BBQ Chicken Pizza', description: 'Grilled chicken, onions, and BBQ sauce.', price: 8200, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop' },
            { id: 'pj-3', name: 'Margherita Pizza', description: 'Simple and delicious with fresh tomatoes and basil.', price: 6800, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983d34?q=80&w=2070&auto=format&fit=crop' },
        ]
    },
    {
        id: 'sweet-sensations',
        name: 'Sweet Sensations',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1980&auto=format&fit=crop',
        cuisine: 'Bakery & Pastries',
        rating: 4.3,
        deliveryTime: '20-30 min',
        priceRange: '₦',
        menu: [
            { id: 'ss-1', name: 'Meat Pie', description: 'Flaky pastry filled with seasoned minced meat.', price: 1200, image: 'https://images.unsplash.com/photo-1627308595186-e6bb36533179?q=80&w=1887&auto=format&fit=crop' },
            { id: 'ss-2', name: 'Doughnut', description: 'Classic glazed doughnut.', price: 800, image: 'https://images.unsplash.com/photo-1551024601-bec78d8d590e?q=80&w=1964&auto=format&fit=crop' },
            { id: 'ss-3', name: 'Red Velvet Cake Slice', description: 'A slice of rich red velvet cake with cream cheese frosting.', price: 2500, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5bPlasma?q=80&w=1887&auto=format&fit=crop' },
        ]
    }
    ,
    {
        id: 'mama-put-kitchen',
        name: 'Mama Put Kitchen',
        image: 'https://images.unsplash.com/photo-1599021470273-e395116715f9?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Nigerian',
        rating: 4.7,
        deliveryTime: '30-40 min',
        priceRange: '₦₦',
        menu: [
            { id: 'mpk-1', name: 'Amala & Ewedu', description: 'Traditional yam flour with jute leaf soup.', price: 3000, image: 'https://images.unsplash.com/photo-1620421683908-f7b5b7b7b7b7?q=80&w=1974&auto=format&fit=crop' },
            { id: 'mpk-2', name: 'Pounded Yam & Egusi', description: 'Pounded yam served with rich melon seed soup.', price: 4500, image: 'https://images.unsplash.com/photo-1620421683908-f7b5b7b7b7b7?q=80&w=1974&auto=format&fit=crop' },
            { id: 'mpk-3', name: 'Rice & Stew', description: 'White rice with a savory tomato stew and choice of meat.', price: 2500, image: 'https://images.unsplash.com/photo-1620421683908-f7b5b7b7b7b7?q=80&w=1974&auto=format&fit=crop' },
        ]
    },
    {
        id: 'burger-barn',
        name: 'Burger Barn',
        image: 'https://images.unsplash.com/photo-1568901346379-8d5c7560f5f0?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Fast Food',
        rating: 4.1,
        deliveryTime: '20-30 min',
        priceRange: '₦₦',
        menu: [
            { id: 'bb-1', name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato, onion.', price: 3800, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1479d29?q=80&w=2070&auto=format&fit=crop' },
            { id: 'bb-2', name: 'Chicken Burger', description: 'Crispy chicken fillet with special sauce.', price: 3500, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2070&auto=format&fit=crop' },
            { id: 'bb-3', name: 'French Fries (Large)', description: 'Golden crispy french fries.', price: 1500, image: 'https://images.unsplash.com/photo-1585337188247-975560c5a3b7?q=80&w=1974&auto=format&fit=crop' },
        ]
    },
    {
        id: 'spice-route',
        name: 'Spice Route (Indian)',
        image: 'https://images.unsplash.com/photo-1565958011703-d28ce147012?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Indian',
        rating: 4.6,
        deliveryTime: '45-55 min',
        priceRange: '₦₦₦₦',
        menu: [
            { id: 'sr-1', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken.', price: 7000, image: 'https://images.unsplash.com/photo-1631452180539-c812c3b8f1d7?q=80&w=1974&auto=format&fit=crop' },
            { id: 'sr-2', name: 'Naan Bread', description: 'Freshly baked Indian flatbread.', price: 1000, image: 'https://images.unsplash.com/photo-1565958011703-d28ce147012?q=80&w=2070&auto=format&fit=crop' },
            { id: 'sr-3', name: 'Vegetable Biryani', description: 'Fragrant basmati rice cooked with mixed vegetables and spices.', price: 6200, image: 'https://images.unsplash.com/photo-1603894584373-5ac87b636230?q=80&w=1974&auto=format&fit=crop' },
        ]
    },
    {
        id: 'sushi-symphony',
        name: 'Sushi Symphony',
        image: 'https://images.unsplash.com/photo-1579871128892-0655180026e6?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Japanese',
        rating: 4.8,
        deliveryTime: '50-60 min',
        priceRange: '₦₦₦₦₦',
        menu: [
            { id: 'ssy-1', name: 'Salmon Nigiri (2 pcs)', description: 'Fresh salmon on seasoned rice.', price: 8000, image: 'https://images.unsplash.com/photo-1579871128892-0655180026e6?q=80&w=2070&auto=format&fit=crop' },
            { id: 'ssy-2', name: 'California Roll (8 pcs)', description: 'Crab, avocado, cucumber, and seaweed.', price: 9500, image: 'https://images.unsplash.com/photo-1579871128892-0655180026e6?q=80&w=2070&auto=format&fit=crop' },
            { id: 'ssy-3', name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed.', price: 2500, image: 'https://images.unsplash.com/photo-1579871128892-0655180026e6?q=80&w=2070&auto=format&fit=crop' },
        ]
    },
    {
        id: 'green-eats',
        name: 'Green Eats',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Healthy',
        rating: 4.4,
        deliveryTime: '30-40 min',
        priceRange: '₦₦₦',
        menu: [
            { id: 'ge-1', name: 'Quinoa Salad', description: 'Fresh quinoa with mixed greens, avocado, and vinaigrette.', price: 5000, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' },
            { id: 'ge-2', name: 'Grilled Chicken Wrap', description: 'Whole wheat wrap with grilled chicken and fresh veggies.', price: 4500, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' },
            { id: 'ge-3', name: 'Berry Smoothie', description: 'Mixed berries, banana, and almond milk.', price: 3000, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' },
        ]
    },
    {
        id: 'taco-fiesta',
        name: 'Taco Fiesta',
        image: 'https://images.unsplash.com/photo-1552332386-b085b3f2f2f2?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Mexican',
        rating: 4.3,
        deliveryTime: '35-45 min',
        priceRange: '₦₦₦',
        menu: [
            { id: 'tf-1', name: 'Chicken Tacos (3 pcs)', description: 'Soft shell tacos with seasoned chicken, salsa, and guacamole.', price: 4800, image: 'https://images.unsplash.com/photo-1552332386-b085b3f2f2f2?q=80&w=2070&auto=format&fit=crop' },
            { id: 'tf-2', name: 'Beef Burrito', description: 'Large burrito filled with seasoned beef, rice, beans, and cheese.', price: 5200, image: 'https://images.unsplash.com/photo-1552332386-b085b3f2f2f2?q=80&w=2070&auto=format&fit=crop' },
            { id: 'tf-3', name: 'Nachos Supreme', description: 'Crispy tortilla chips topped with cheese, jalapeños, and sour cream.', price: 4000, image: 'https://images.unsplash.com/photo-1552332386-b085b3f2f2f2?q=80&w=2070&auto=format&fit=crop' },
        ]
    },
    {
        id: 'wok-express',
        name: 'Wok Express',
        image: 'https://images.unsplash.com/photo-1504674900247-087700f9d130?q=80&w=2070&auto=format&fit=crop',
        cuisine: 'Asian',
        rating: 4.0,
        deliveryTime: '40-50 min',
        priceRange: '₦₦₦',
        menu: [
            { id: 'we-1', name: 'Sweet & Sour Chicken', description: 'Crispy chicken pieces with tangy sweet and sour sauce.', price: 5800, image: 'https://images.unsplash.com/photo-1504674900247-087700f9d130?q=80&w=2070&auto=format&fit=crop' },
            { id: 'we-2', name: 'Vegetable Fried Rice', description: 'Classic fried rice with mixed vegetables.', price: 3500, image: 'https://images.unsplash.com/photo-1504674900247-087700f9d130?q=80&w=2070&auto=format&fit=crop' },
            { id: 'we-3', name: 'Spring Rolls (4 pcs)', description: 'Crispy vegetable spring rolls with sweet chili dip.', price: 2000, image: 'https://images.unsplash.com/photo-1504674900247-087700f9d130?q=80&w=2070&auto=format&fit=crop' },
        ]
    }
];

export const fetchRestaurants = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(MOCK_RESTAURANTS), 1000);
    });
};

export const fetchRestaurantById = (id) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
            resolve(restaurant);
        }, 500);
    });
};
