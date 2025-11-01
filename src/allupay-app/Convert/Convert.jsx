import styles from './Convert.module.css';
import usdtIcon from '../../assets/Convert.png'; // Replace with actual USDT icon
import hbarIcon from '../../assets/Dashboard.png'; // Replace with actual HBAR icon
import logo1 from '../../assets/logo/logo1.png'
import { Link, NavLink } from 'react-router-dom';

function Convert() {
  return (
    <div className={styles.convert_main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src={logo1} alt="AlluPay Logo" className={styles.logo} />
          {/* <span className={styles.logoText}>AlluPay</span> */}
        </div>
        <div className={styles.headerRight}>
          <span className={styles.walletSelect}>Wallet ▼</span>
          <div className={styles.headerIcons}>
            <span>🌐 EN</span>
            <span>🔍</span>
            <span>🔔</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navbar}>
        <ul>
          <li><Link to="/payment">Send</Link></li>
          <li><NavLink to="/convert" className={({ isActive }) => isActive ? styles.active : ''}>Convert</NavLink></li>
          <li><Link to="/buy">Buy</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/swap">Swap</Link></li>
        </ul>
      </nav>

      {/* Convert Form Section */}
      <form className={styles.convertForm}>
        <div className={styles.convertColumn}>
          {/* From */}
          <div className={styles.convertFrom}>
            <label className={styles.convertLabel}>From</label>
            <div className={styles.tokenBox}>
                <div className={styles.tokenSelect}>
                  <img src={usdtIcon} alt="USDT" className={styles.tokenImg} />
                  <span>USDT ▼</span>
                </div>
              
                <div className={styles.convertAmountBox}>
                  <span className={styles.convertAmount}>0.00 USDT <span className={styles.plusIcon}>+</span></span>
                  <span className={styles.convertRange}>0.01 - 5000</span>
                  <span className={styles.convertMax}>MAX</span>
                </div>
            </div>
          </div>
          {/* Arrow */}
          <div className={styles.convertArrow}>
            <span>⇅</span>
          </div>
          {/* To */}
          <div className={styles.convertTo}>
            <label className={styles.convertLabel}>To</label>
            <div className={styles.tokenBox}>
                <div className={styles.tokenSelect}>
                  <img src={hbarIcon} alt="HBAR" className={styles.tokenImg} />
                  <span>HBAR ▼</span>
               </div>
              
               <div className={styles.convertRange}>0.0058 - 2000</div>
            </div>
          </div>
        </div>
        <button type="submit" className={styles.convertBtn}>Convert</button>
      </form>
    </div>
  );
}

export default Convert;