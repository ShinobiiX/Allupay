import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import logo1 from '../../assets/logo/logo1.png';

function Layout() {
    return (
        <div className={styles.layout_main}>
            {/* Navigation */}
            <nav className={styles.navbar}>
                <div className={styles.logoSection}>
                    <img src={logo1} alt="AlluPay Logo" className={styles.logo} />
                </div>
                <ul>
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink></li>
                    {/* <li><NavLink to="/payment" className={({ isActive }) => isActive ? styles.active : ''}>Payment</NavLink></li> */}
                    <li><NavLink to="/transfer" className={({ isActive }) => isActive ? styles.active : ''}>Transfer</NavLink></li>
                    <li><NavLink to="/history" className={({ isActive }) => isActive ? styles.active : ''}>History</NavLink></li>
                    <li><NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : ''}>Settings</NavLink></li>
                </ul>
            </nav>

            {/* Page content will be rendered here */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;