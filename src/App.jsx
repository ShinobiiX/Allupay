import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import Dashboard from './allupay-app/Dashboard/Dashboard.jsx';
import Momo from './allupay-app/Momo/Momo.jsx';
import Bank from './allupay-app/Bank/Bank.jsx';
import Convert from './allupay-app/Convert/Convert.jsx';
import Signup from './allupay-app/Signup/Signup.jsx';
import Signin from './allupay-app/Signin/Signin.jsx';
import Home from './allupay-app/Home/Home.jsx';
import Layout from './allupay-app/Layout/Layout.jsx';
import Settings from './allupay-app/Settings/Settings.jsx';
import Account from './allupay-app/Settings/Account.jsx';
import Notification from './allupay-app/Settings/Notification.jsx';
import Privacy from './allupay-app/Settings/Privacy.jsx';
import Theme from './allupay-app/Settings/Theme.jsx';
import Help from './allupay-app/Settings/Help.jsx';
import History from './allupay-app/History/History';
import Cryptocurrency from './allupay-app/Cryptocurrency/Cryptocurrency';
import EventsPage from './allupay-app/Events/EventsPage';
import FoodPage from './allupay-app/Food/FoodPage.jsx';
import RestaurantPage from './allupay-app/Food/RestaurantPage.jsx';
import CartPage from './allupay-app/Food/CartPage.jsx';
import MoviesPage from './allupay-app/Movies/MoviesPage.jsx';
import MovieDetailsPage from './allupay-app/Movies/MovieDetailsPage.jsx';
import MovieTicketPage from './allupay-app/Movies/MovieTicketPage.jsx';
import { CartProvider } from './allupay-app/Food/CartContext.jsx'; // New import
import FlightsPage from './allupay-app/Flights/FlightsPage';
import EventDetailsPage from './allupay-app/Events/EventDetailsPage';
import TicketPage from './allupay-app/Events/TicketPage';
import FlightBookingPage from './allupay-app/Flights/FlightBookingPage';
import FlightTicketPage from './allupay-app/Flights/FlightTicketPage';
import { HistoryProvider } from './allupay-app/History/HistoryContext.jsx';
import { BalanceProvider } from './allupay-app/Balance/BalanceContext.jsx';
import { ThemeProvider } from './allupay-app/Hooks/useTheme.jsx';





export default function App(){
  return (    
    <BalanceProvider>
        <HistoryProvider>
            <ThemeProvider>
                <CartProvider> {/* Wrap the entire app with CartProvider */}
                    <BrowserRouter>
                        <Routes>
                            {/* Routes with the main layout */}
                            <Route element={<Layout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                {/* Assuming /payment shows bank, and /momo is a sub-route or separate */}
                                <Route path="/transfer" element={<Bank />} />
                                <Route path="/momo" element={<Momo />} />
                                <Route path="/cryptocurrency" element={<Cryptocurrency />} />
                                <Route path="/events" element={<EventsPage />} />
                                <Route path="/events/:eventId" element={<EventDetailsPage />} />
                                <Route path="/food" element={<FoodPage />} />
                                <Route path="/food/:restaurantId" element={<RestaurantPage />} /> {/* New route */}
                                <Route path="/movies" element={<MoviesPage />} />
                                <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
                                <Route path="/movies/ticket/:ticketId" element={<MovieTicketPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/flights" element={<FlightsPage />} />
                                <Route path="/events/ticket/:ticketId" element={<TicketPage />} />
                                <Route path="/flights/book" element={<FlightBookingPage />} />
                                <Route path="/flights/ticket/:ticketId" element={<FlightTicketPage />} />
                                {/* Add other routes for Layout here if needed */}
                                {/* <Route path="/transfer" element={<Transfer />} /> */}
                                <Route path="/history" element={<History />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/settings/account" element={<Account />} />
                                <Route path="/settings/notification" element={<Notification />} />
                                <Route path="/settings/privacy" element={<Privacy />} />
                                <Route path="/settings/theme" element={<Theme />} />
                                <Route path="/settings/help" element={<Help />} />
                            </Route>
                
                            {/* Standalone routes */}
                            <Route path="/convert" element={<Convert />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/signin" element={<Signin />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/transfer/crypto" element={<Cryptocurrency />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </ThemeProvider>
        </HistoryProvider>
    </BalanceProvider>
  );
}
