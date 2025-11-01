import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sharedStyles from '../Events/Events.module.css';
import styles from './Flights.module.css';
import { UserIcon } from '../Dashboard/icons.jsx';

const MOCK_FLIGHTS = [
    { id: 1, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '08:30', arrival: '09:45', duration: '1h 15m', price: 45000, stops: 'Non-stop' },
    { id: 2, airline: 'Ibom Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '10:00', arrival: '11:15', duration: '1h 15m', price: 52000, stops: 'Non-stop' },
    { id: 3, airline: 'Arik Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '12:45', arrival: '15:00', duration: '2h 15m', price: 48500, stops: '1 stop (PHC)' },
    { id: 4, airline: 'Dana Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '16:00', arrival: '17:15', duration: '1h 15m', price: 47000, stops: 'Non-stop' },    
    { id: 5, airline: 'British Airways', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'LHR', city: 'London', country: 'UK' }, departure: '22:50', arrival: '05:20', duration: '6h 30m', price: 850000, stops: 'Non-stop' },
    { id: 6, airline: 'Emirates', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'DXB', city: 'Dubai', country: 'UAE' }, departure: '18:40', arrival: '05:40', duration: '8h 0m', price: 720000, stops: 'Non-stop' },
    { id: 7, airline: 'Qatar Airways', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'DOH', city: 'Doha', country: 'Qatar' }, departure: '14:00', arrival: '22:30', duration: '7h 30m', price: 910000, stops: 'Non-stop' },
    { id: 8, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ACC', city: 'Accra', country: 'Ghana' }, departure: '07:00', arrival: '07:00', duration: '1h 0m', price: 120000, stops: 'Non-stop' },
    { id: 9, airline: 'Air Canada', from: { code: 'YYZ', city: 'Toronto', country: 'Canada' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '21:00', arrival: '13:30', duration: '15h 30m', price: 1250000, stops: '1 stop (LHR)' },
    { id: 10, airline: 'Delta', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'JFK', city: 'New York', country: 'US' }, departure: '12:00', arrival: '17:30', duration: '11h 30m', price: 1150000, stops: 'Non-stop' },
    { id: 11, airline: 'Lufthansa', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'FRA', city: 'Frankfurt', country: 'Germany' }, departure: '23:05', arrival: '06:30', duration: '6h 25m', price: 980000, stops: 'Non-stop' },
    { id: 12, airline: 'Turkish Airlines', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'IST', city: 'Istanbul', country: 'Turkey' }, departure: '21:40', arrival: '06:20', duration: '7h 40m', price: 890000, stops: 'Non-stop' },
    { id: 13, airline: 'Air India', from: { code: 'BOM', city: 'Mumbai', country: 'India' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '08:00', arrival: '18:00', duration: '13h 0m', price: 1050000, stops: '1 stop (DXB)' },
    { id: 14, airline: 'Iberia', from: { code: 'MAD', city: 'Madrid', country: 'Spain' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '11:00', arrival: '16:30', duration: '5h 30m', price: 920000, stops: 'Non-stop' },
    { id: 15, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria' }, departure: '09:00', arrival: '10:00', duration: '1h 0m', price: 48000, stops: 'Non-stop' },
    { id: 16, airline: 'Ibom Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'KAN', city: 'Kano', country: 'Nigeria' }, departure: '11:30', arrival: '12:30', duration: '1h 0m', price: 55000, stops: 'Non-stop' },
    { id: 17, airline: 'Arik Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ENU', city: 'Enugu', country: 'Nigeria' }, departure: '14:00', arrival: '15:00', duration: '1h 0m', price: 46500, stops: 'Non-stop' },
    { id: 18, airline: 'Max Air', from: { code: 'KAN', city: 'Kano', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '17:00', arrival: '18:15', duration: '1h 15m', price: 51000, stops: 'Non-stop' },
    { id: 19, airline: 'Air Peace', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria' }, departure: '13:00', arrival: '14:10', duration: '1h 10m', price: 49500, stops: 'Non-stop' },
    { id: 20, airline: 'Dana Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'QOW', city: 'Owerri', country: 'Nigeria' }, departure: '07:30', arrival: '08:40', duration: '1h 10m', price: 44000, stops: 'Non-stop' },
    { id: 21, airline: 'Arik Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'BNI', city: 'Benin City', country: 'Nigeria' }, departure: '15:00', arrival: '16:00', duration: '1h 0m', price: 58000, stops: 'Non-stop' },
    { id: 22, airline: 'Ibom Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'CBQ', city: 'Calabar', country: 'Nigeria' }, departure: '10:30', arrival: '11:45', duration: '1h 15m', price: 62000, stops: 'Non-stop' },
    { id: 23, airline: 'Max Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'JOS', city: 'Jos', country: 'Nigeria' }, departure: '14:00', arrival: '14:50', duration: '0h 50m', price: 53000, stops: 'Non-stop' },
    { id: 24, airline: 'Air Peace', from: { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria' }, to: { code: 'KAN', city: 'Kano', country: 'Nigeria' }, departure: '12:00', arrival: '13:30', duration: '1h 30m', price: 68000, stops: 'Non-stop' },
    { id: 25, airline: 'Green Africa', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'IBA', city: 'Ibadan', country: 'Nigeria' }, departure: '18:00', arrival: '18:30', duration: '0h 30m', price: 25000, stops: 'Non-stop' },
    { id: 26, airline: 'Arik Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'KAD', city: 'Kaduna', country: 'Nigeria' }, departure: '11:00', arrival: '12:15', duration: '1h 15m', price: 61000, stops: 'Non-stop' },
    { id: 27, airline: 'Ibom Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'QUO', city: 'Uyo', country: 'Nigeria' }, departure: '16:30', arrival: '17:30', duration: '1h 0m', price: 59000, stops: 'Non-stop' },
    { id: 28, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'YOL', city: 'Yola', country: 'Nigeria' }, departure: '10:00', arrival: '11:40', duration: '1h 40m', price: 72000, stops: 'Non-stop' },
    { id: 29, airline: 'Max Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'MIU', city: 'Maiduguri', country: 'Nigeria' }, departure: '09:30', arrival: '10:50', duration: '1h 20m', price: 75000, stops: 'Non-stop' },
    { id: 30, airline: 'Arik Air', from: { code: 'KAN', city: 'Kano', country: 'Nigeria' }, to: { code: 'SKO', city: 'Sokoto', country: 'Nigeria' }, departure: '13:00', arrival: '13:50', duration: '0h 50m', price: 48000, stops: 'Non-stop' },
    { id: 31, airline: 'Green Africa', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ILR', city: 'Ilorin', country: 'Nigeria' }, departure: '15:30', arrival: '16:15', duration: '0h 45m', price: 35000, stops: 'Non-stop' },
    { id: 32, airline: 'Air Peace', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'ABB', city: 'Asaba', country: 'Nigeria' }, departure: '17:00', arrival: '17:55', duration: '0h 55m', price: 54000, stops: 'Non-stop' },
    { id: 33, airline: 'Ibom Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'QUO', city: 'Uyo', country: 'Nigeria' }, departure: '08:00', arrival: '09:00', duration: '1h 0m', price: 60000, stops: 'Non-stop' },
    { id: 34, airline: 'Dana Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'ENU', city: 'Enugu', country: 'Nigeria' }, departure: '12:30', arrival: '13:30', duration: '1h 0m', price: 51500, stops: 'Non-stop' },
    { id: 35, airline: 'Max Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'KAD', city: 'Kaduna', country: 'Nigeria' }, departure: '14:00', arrival: '15:15', duration: '1h 15m', price: 63000, stops: 'Non-stop' },
    { id: 36, airline: 'Arik Air', from: { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '10:30', arrival: '11:40', duration: '1h 10m', price: 50500, stops: 'Non-stop' },
    { id: 37, airline: 'Green Africa', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'AKR', city: 'Akure', country: 'Nigeria' }, departure: '13:00', arrival: '13:45', duration: '0h 45m', price: 41000, stops: 'Non-stop' },
    { id: 38, airline: 'Max Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'DKA', city: 'Katsina', country: 'Nigeria' }, departure: '11:00', arrival: '12:00', duration: '1h 0m', price: 65000, stops: 'Non-stop' },
    { id: 39, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ANA', city: 'Anambra', country: 'Nigeria' }, departure: '09:30', arrival: '10:30', duration: '1h 0m', price: 65000, stops: 'Non-stop' },
    // --- Final Comprehensive Local Routes from Lagos ---
    { id: 40, airline: 'Overland Airways', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'BCU', city: 'Bauchi', country: 'Nigeria' }, departure: '10:00', arrival: '11:30', duration: '1h 30m', price: 78000, stops: 'Non-stop' },
    { id: 41, airline: 'United Nigeria', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'BYE', city: 'Yenagoa', country: 'Nigeria' }, departure: '12:15', arrival: '13:25', duration: '1h 10m', price: 68000, stops: 'Non-stop' },
    { id: 42, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'MDI', city: 'Makurdi', country: 'Nigeria' }, departure: '14:30', arrival: '15:40', duration: '1h 10m', price: 71000, stops: 'Non-stop' },
    { id: 43, airline: 'Max Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'MIU', city: 'Maiduguri', country: 'Nigeria' }, departure: '08:45', arrival: '10:25', duration: '1h 40m', price: 82000, stops: 'Non-stop' },
    { id: 44, airline: 'ValueJet', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'GMO', city: 'Gombe', country: 'Nigeria' }, departure: '11:00', arrival: '12:35', duration: '1h 35m', price: 76000, stops: 'Non-stop' },
    { id: 45, airline: 'Arik Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'DUT', city: 'Dutse', country: 'Nigeria' }, departure: '13:00', arrival: '14:20', duration: '1h 20m', price: 73000, stops: 'Non-stop' },
    { id: 46, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'DKA', city: 'Katsina', country: 'Nigeria' }, departure: '09:00', arrival: '10:20', duration: '1h 20m', price: 79000, stops: 'Non-stop' },
    { id: 47, airline: 'Arik Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'KBK', city: 'Birnin Kebbi', country: 'Nigeria' }, departure: '15:00', arrival: '16:30', duration: '1h 30m', price: 81000, stops: 'Non-stop' },
    { id: 48, airline: 'Overland Airways', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'MXJ', city: 'Minna', country: 'Nigeria' }, departure: '16:00', arrival: '17:00', duration: '1h 0m', price: 64000, stops: 'Non-stop' },
    { id: 49, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'SKO', city: 'Sokoto', country: 'Nigeria' }, departure: '10:30', arrival: '12:00', duration: '1h 30m', price: 85000, stops: 'Non-stop' },
    { id: 50, airline: 'United Nigeria', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'EBS', city: 'Abakaliki', country: 'Nigeria' }, departure: '12:00', arrival: '13:00', duration: '1h 0m', price: 67000, stops: 'Non-stop' },
    { id: 51, airline: 'Green Africa', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'AKD', city: 'Ado-Ekiti', country: 'Nigeria' }, departure: '17:00', arrival: '17:40', duration: '0h 40m', price: 38000, stops: 'Non-stop' },
    { id: 52, airline: 'Max Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'KAN', city: 'Kano', country: 'Nigeria' }, departure: '07:00', arrival: '08:15', duration: '1h 15m', price: 58000, stops: 'Non-stop' },
    { id: 53, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'QRW', city: 'Warri', country: 'Nigeria' }, departure: '11:30', arrival: '12:30', duration: '1h 0m', price: 52000, stops: 'Non-stop' },
    { id: 54, airline: 'Overland Airways', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'JAL', city: 'Jalingo', country: 'Nigeria' }, departure: '13:30', arrival: '15:00', duration: '1h 30m', price: 88000, stops: 'Non-stop' },
    { id: 55, airline: 'ValueJet', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'JOS', city: 'Jos', country: 'Nigeria' }, departure: '14:00', arrival: '15:10', duration: '1h 10m', price: 69000, stops: 'Non-stop' },
    { id: 56, airline: 'Ibom Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'BNI', city: 'Benin City', country: 'Nigeria' }, departure: '16:00', arrival: '16:50', duration: '0h 50m', price: 49000, stops: 'Non-stop' },
    { id: 57, airline: 'Green Africa', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ILR', city: 'Ilorin', country: 'Nigeria' }, departure: '08:00', arrival: '08:45', duration: '0h 45m', price: 36000, stops: 'Non-stop' },
    { id: 58, airline: 'Air Peace', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'CBQ', city: 'Calabar', country: 'Nigeria' }, departure: '12:45', arrival: '14:00', duration: '1h 15m', price: 63000, stops: 'Non-stop' },
    { id: 59, airline: 'United Nigeria', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'ABB', city: 'Asaba', country: 'Nigeria' }, departure: '15:00', arrival: '15:55', duration: '0h 55m', price: 55000, stops: 'Non-stop' },
    { id: 60, airline: 'Max Air', from: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, to: { code: 'YOL', city: 'Yola', country: 'Nigeria' }, departure: '09:15', arrival: '10:55', duration: '1h 40m', price: 74000, stops: 'Non-stop' },
    // --- Comprehensive Local Routes TO Lagos (Return Flights) ---
    { id: 61, airline: 'Air Peace', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '18:00', arrival: '19:15', duration: '1h 15m', price: 46000, stops: 'Non-stop' },
    { id: 62, airline: 'Arik Air', from: { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '19:00', arrival: '20:00', duration: '1h 0m', price: 49000, stops: 'Non-stop' },
    { id: 63, airline: 'United Nigeria', from: { code: 'ENU', city: 'Enugu', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '16:00', arrival: '17:00', duration: '1h 0m', price: 47500, stops: 'Non-stop' },
    { id: 64, airline: 'Dana Air', from: { code: 'QOW', city: 'Owerri', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '10:00', arrival: '11:10', duration: '1h 10m', price: 45000, stops: 'Non-stop' },
    { id: 65, airline: 'Ibom Air', from: { code: 'BNI', city: 'Benin City', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '18:00', arrival: '18:50', duration: '0h 50m', price: 50000, stops: 'Non-stop' },
    { id: 66, airline: 'Ibom Air', from: { code: 'CBQ', city: 'Calabar', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '13:00', arrival: '14:15', duration: '1h 15m', price: 63000, stops: 'Non-stop' },
    { id: 67, airline: 'Green Africa', from: { code: 'IBA', city: 'Ibadan', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '19:00', arrival: '19:30', duration: '0h 30m', price: 26000, stops: 'Non-stop' },
    { id: 68, airline: 'Max Air', from: { code: 'KAD', city: 'Kaduna', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '16:30', arrival: '17:45', duration: '1h 15m', price: 64000, stops: 'Non-stop' },
    { id: 69, airline: 'Ibom Air', from: { code: 'QUO', city: 'Uyo', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '10:00', arrival: '11:00', duration: '1h 0m', price: 61000, stops: 'Non-stop' },
    { id: 70, airline: 'Max Air', from: { code: 'YOL', city: 'Yola', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '12:00', arrival: '13:40', duration: '1h 40m', price: 75000, stops: 'Non-stop' },
    { id: 71, airline: 'Green Africa', from: { code: 'ILR', city: 'Ilorin', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '10:00', arrival: '10:45', duration: '0h 45m', price: 37000, stops: 'Non-stop' },
    { id: 72, airline: 'United Nigeria', from: { code: 'ABB', city: 'Asaba', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '17:00', arrival: '17:55', duration: '0h 55m', price: 56000, stops: 'Non-stop' },
    { id: 73, airline: 'Green Africa', from: { code: 'AKR', city: 'Akure', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '15:00', arrival: '15:45', duration: '0h 45m', price: 42000, stops: 'Non-stop' },
    { id: 74, airline: 'Air Peace', from: { code: 'ANA', city: 'Anambra', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '12:00', arrival: '13:00', duration: '1h 0m', price: 66000, stops: 'Non-stop' },
    { id: 75, airline: 'Max Air', from: { code: 'JOS', city: 'Jos', country: 'Nigeria' }, to: { code: 'LOS', city: 'Lagos', country: 'Nigeria' }, departure: '16:30', arrival: '17:40', duration: '1h 10m', price: 70000, stops: 'Non-stop' },
    // --- Comprehensive Local Routes To/From Abuja ---
    { id: 76, airline: 'ValueJet', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'QRW', city: 'Warri', country: 'Nigeria' }, departure: '09:00', arrival: '10:00', duration: '1h 0m', price: 53000, stops: 'Non-stop' },
    { id: 77, airline: 'ValueJet', from: { code: 'QRW', city: 'Warri', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '11:00', arrival: '12:00', duration: '1h 0m', price: 53000, stops: 'Non-stop' },
    { id: 78, airline: 'Air Peace', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'YOL', city: 'Yola', country: 'Nigeria' }, departure: '13:00', arrival: '14:40', duration: '1h 40m', price: 73000, stops: 'Non-stop' },
    { id: 79, airline: 'Air Peace', from: { code: 'YOL', city: 'Yola', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '15:30', arrival: '17:10', duration: '1h 40m', price: 73000, stops: 'Non-stop' },
    { id: 80, airline: 'Overland Airways', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'AKR', city: 'Akure', country: 'Nigeria' }, departure: '14:00', arrival: '15:00', duration: '1h 0m', price: 58000, stops: 'Non-stop' },
    { id: 81, airline: 'Overland Airways', from: { code: 'AKR', city: 'Akure', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '16:00', arrival: '17:00', duration: '1h 0m', price: 58000, stops: 'Non-stop' },
    { id: 82, airline: 'Arik Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'SKO', city: 'Sokoto', country: 'Nigeria' }, departure: '10:00', arrival: '11:10', duration: '1h 10m', price: 71000, stops: 'Non-stop' },
    { id: 83, airline: 'Arik Air', from: { code: 'SKO', city: 'Sokoto', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '12:00', arrival: '13:10', duration: '1h 10m', price: 71000, stops: 'Non-stop' },
    { id: 84, airline: 'Ibom Air', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'CBQ', city: 'Calabar', country: 'Nigeria' }, departure: '09:30', arrival: '10:45', duration: '1h 15m', price: 64000, stops: 'Non-stop' },
    { id: 85, airline: 'Ibom Air', from: { code: 'CBQ', city: 'Calabar', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '11:30', arrival: '12:45', duration: '1h 15m', price: 64000, stops: 'Non-stop' },
    { id: 86, airline: 'United Nigeria', from: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, to: { code: 'ANA', city: 'Anambra', country: 'Nigeria' }, departure: '14:30', arrival: '15:30', duration: '1h 0m', price: 67000, stops: 'Non-stop' },
    { id: 87, airline: 'United Nigeria', from: { code: 'ANA', city: 'Anambra', country: 'Nigeria' }, to: { code: 'ABV', city: 'Abuja', country: 'Nigeria' }, departure: '16:30', arrival: '17:30', duration: '1h 0m', price: 67000, stops: 'Non-stop' },
];

const POPULAR_LOCAL_ROUTES = [
    { from: 'Lagos', to: 'Abuja', fromCode: 'LOS', toCode: 'ABV' },
    { from: 'Lagos', to: 'Port Harcourt', fromCode: 'LOS', toCode: 'PHC' },
    { from: 'Lagos', to: 'Kano', fromCode: 'LOS', toCode: 'KAN' },
    { from: 'Lagos', to: 'Enugu', fromCode: 'LOS', toCode: 'ENU' },
];

const POPULAR_INTL_ROUTES = [
    { from: 'Lagos', to: 'London', fromCode: 'LOS', toCode: 'LHR' },
    { from: 'Lagos', to: 'New York', fromCode: 'LOS', toCode: 'JFK' },
    { from: 'Toronto', to: 'Lagos', fromCode: 'YYZ', toCode: 'LOS' },
    { from: 'Lagos', to: 'Frankfurt', fromCode: 'LOS', toCode: 'FRA' },
];

const FlightCard = ({ flight, onBook }) => (
    <div className={styles.flightCard} onClick={() => onBook(flight)}>
        <div className={styles.airlineInfo}>
            <span className={styles.airline}>{flight.airline}</span>
            <span className={styles.stops}>{flight.stops}</span>
        </div>
        <div className={styles.flightDetails}>
            <div className={styles.timeLocation}>
                <span className={styles.time}>{flight.departure}</span>
                <span className={styles.location}>{flight.from.code}</span>
            </div>
            <div className={styles.duration}>
                <span className={styles.durationText}>{flight.duration}</span>
                <div className={styles.line}></div>
                <span className={styles.planeIcon}>✈</span>
            </div>
            <div className={styles.timeLocation}>
                <span className={styles.time}>{flight.arrival}</span>
                <span className={styles.location}>{flight.to.code}</span>
            </div>
        </div>
        <div className={styles.priceSection}>
            <span className={styles.price}>₦{flight.price.toLocaleString()}</span>
            <button className={styles.bookButton}>Book Now</button>
        </div>
    </div>
);

const PassengerSelector = ({ adults, setAdults, children, setChildren, infants, setInfants, onClose }) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const PassengerRow = ({ label, value, setValue, min = 0 }) => (
        <div className={styles.passengerRow}>
            <span>{label}</span>
            <div className={styles.passengerControls}>
                <button type="button" onClick={() => setValue(Math.max(min, value - 1))} disabled={value <= min}>-</button>
                <span>{value}</span>
                <button type="button" onClick={() => setValue(value + 1)}>+</button>
            </div>
        </div>
    );

    return (
        <div className={styles.passengerPopup} ref={ref}>
            <PassengerRow label="Adults" value={adults} setValue={setAdults} min={1} />
            <PassengerRow label="Children" value={children} setValue={setChildren} />
            <PassengerRow label="Infants" value={infants} setValue={setInfants} />
        </div>
    );
};

export default function FlightsPage() {
    const navigate = useNavigate();
    const [tripType, setTripType] = useState('return');
    const [from, setFrom] = useState('LOS');
    const [to, setTo] = useState('ABV');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [showPassengerSelector, setShowPassengerSelector] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [flights, setFlights] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSwapLocations = () => {
        setFrom(to);
        setTo(from);
    };

    const totalPassengers = adults + children + infants;

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFlights([]);
        setHasSearched(true);

        const fromTerm = from.toLowerCase();
        const toTerm = to.toLowerCase();

        setTimeout(() => {
            const results = MOCK_FLIGHTS.filter(flight => {
                const fromMatch = flight.from.code.toLowerCase() === fromTerm || flight.from.city.toLowerCase().includes(fromTerm) || flight.from.country.toLowerCase() === fromTerm;
                const toMatch = flight.to.code.toLowerCase() === toTerm || flight.to.city.toLowerCase().includes(toTerm) || flight.to.country.toLowerCase() === toTerm;
                return fromMatch && toMatch;
            });
            setFlights(results);
            setIsLoading(false);
        }, 1500);
    };

    // Wrapper to use in onClick for popular routes
    const searchWithRoute = (fromCode, toCode) => (e) => {
        setFrom(fromCode);
        setTo(toCode);
        handleSearch(e);
    };

    const handleBookFlight = (flight) => {
        const bookingDetails = {
            flight,
            passengers: { adults, children, infants },
            tripType,
        };
        navigate('/flights/book', { state: { bookingDetails } });
    };

    return (
        <div className={sharedStyles.page}>
            <header className={sharedStyles.header}>
                <Link to="/dashboard" className={sharedStyles.backButton}>← Back to Dashboard</Link>
                <h1 className={sharedStyles.title}>Book a Flight</h1>
            </header>
            <header className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Where to next?</h1>
                    <p className={styles.heroSubtitle}>Book local and international flights with ease.</p>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.searchContainer}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.tripTypeSelector}>
                            <label className={tripType === 'return' ? styles.active : ''}>
                                <input type="radio" name="tripType" value="return" checked={tripType === 'return'} onChange={(e) => setTripType(e.target.value)} />
                                Return
                            </label>
                            <label className={tripType === 'one-way' ? styles.active : ''}>
                                <input type="radio" name="tripType" value="one-way" checked={tripType === 'one-way'} onChange={(e) => setTripType(e.target.value)} />
                                One-way
                            </label>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="from">From</label>
                                <input type="text" id="from" value={from} onChange={e => setFrom(e.target.value)} placeholder="Lagos (LOS)" required />
                            </div>
                            <div className={styles.swapIcon} onClick={handleSwapLocations}>⇄</div>
                            <div className={styles.formGroup}>
                                <label htmlFor="to">To</label>
                                <input type="text" id="to" value={to} onChange={e => setTo(e.target.value)} placeholder="Abuja (ABV)" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="departure">Departure</label>
                                <input type="date" id="departure" required />
                            </div>
                            <div className={`${styles.formGroup} ${tripType === 'one-way' ? styles.disabled : ''}`}>
                                <label htmlFor="return">Return</label>
                                <input type="date" id="return" disabled={tripType === 'one-way'} />
                            </div>
                            <div className={styles.formGroup} style={{ position: 'relative' }}>
                                <label htmlFor="passengers">Passengers</label>
                                <div className={styles.inputWithIcon} onClick={() => setShowPassengerSelector(!showPassengerSelector)}>
                                    <UserIcon />
                                    <input id="passengers" type="text" value={`${totalPassengers} passenger${totalPassengers > 1 ? 's' : ''}`} readOnly />
                                </div>
                                {showPassengerSelector && (
                                    <PassengerSelector adults={adults} setAdults={setAdults} children={children} setChildren={setChildren} infants={infants} setInfants={setInfants} onClose={() => setShowPassengerSelector(false)} />
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="class">Class</label>
                                <select id="class">
                                    <option>Economy</option>
                                    <option>Business</option>
                                    <option>First Class</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className={styles.searchButton} disabled={isLoading}>
                            {isLoading ? 'Searching...' : 'Search Flights'}
                        </button>
                    </form>
                </div>

                <div className={styles.popularRoutesSection}>
                    <div className={styles.routeList}>
                        <h3 className={styles.routeListTitle}>Popular Local Routes</h3>
                        <ul>
                            {POPULAR_LOCAL_ROUTES.map(route => (
                                <li key={`${route.from}-${route.to}`}><button onClick={searchWithRoute(route.fromCode, route.toCode)}>{route.from} → {route.to}</button></li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.routeList}>
                        <h3 className={styles.routeListTitle}>Popular International Routes</h3>
                        <ul>
                            {POPULAR_INTL_ROUTES.map(route => (
                                <li key={`${route.from}-${route.to}`}><button onClick={searchWithRoute(route.fromCode, route.toCode)}>{route.from} → {route.to}</button></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.resultsContainer}>
                    {!hasSearched && !isLoading && (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>✈️</div>
                            <h2>Find your next flight</h2>
                            <p>Enter your travel details above to see available flights.</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p>Finding the best flights for you...</p>
                        </div>
                    )}
                    {hasSearched && !isLoading && flights.length > 0 && (
                        <>
                            <h2 className={styles.resultsTitle}>Available Flights: {from.toUpperCase()} to {to.toUpperCase()}</h2>
                            <div className={styles.flightsGrid}>
                                {flights.map(flight => <FlightCard key={flight.id} flight={flight} onBook={handleBookFlight} />)}
                            </div>
                        </>
                    )}
                    {hasSearched && !isLoading && flights.length === 0 && (
                         <div className={styles.emptyState}>
                            <p>No flights found for this route. Please try another search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
