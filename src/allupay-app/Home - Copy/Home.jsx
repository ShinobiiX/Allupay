import styles from './Home.module.css';
import dashboardImg from '../../assets/Dashboard.png';
import logo1 from '../../assets/logo/logo1.png'; 
import img1 from '../../assets/image1.png';
import img2 from '../../assets/image2.png';
import img3 from '../../assets/image3.png';
import img4 from '../../assets/image4.png';
import img5 from '../../assets/image5.png';
import img7 from '../../assets/image7.png';
import img8 from '../../assets/image8.png';
import img9 from '../../assets/image9.png';
import img10 from '../../assets/image10.png';
import img11 from '../../assets/image11.png';
import img12 from '../../assets/image12.png';


function Home() {
  return (
    <div className={styles.home_main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
            <img src={logo1} alt="AlluPay" />
          {/* <span className={styles.logo}>Allupay</span> */}
        </div>
        <nav className={styles.navbar}>
          <span>Help</span>
          <span>🔍</span>
          <span>EN</span>
          <button className={styles.getStartedBtn}>Get Started</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Payment Without <br/> Borders, Settlements <br/> Without Delay.</h1>
          <p>Unlock the future of payments with our multi-chain gateway</p>
          <p> that bridges crypto, stablecoins, mobile money, and flat in one </p>
          <p>seamless platform. Whether you're sending cross-border </p>
          <p>remittances, integrating payments into your app, or managing </p>
          <p>merchant transactions, our Hedera-powered gateway makes it </p>
          <p>fast, secure and borderless.</p>
          <button className={styles.exploreBtn}>Explore</button>
        </div>
        <div className={styles.heroImage}>
          <img src={img1} alt="Hero" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseSection}>
        <h2>Why Choose Us</h2>
        <p>We go beyond just crypto by integrating stablecoins pegged to USD/EUR, Africa-</p>
        <p>focused digital currencies and mobile money wallets like M-Pesa, MTN Mobile Money</p>
        <p>and Airtel Money, because financial inclusion means reaching people where they are.</p>
        <p>We built in support for cross-chain interoperability, our platform ensures money</p>
        <p>moves across Hedera, Ethereum, BNB Chain, Solana, etc, in under 10 seconds. All</p>
        <p>powered by Hedera’s consensus services.</p>
        <div className={`${styles.cardsRow} ${styles.cardsRow1}`}>
          <div className={`${styles.card} ${styles.card1}`}>
            <img src={img2} alt="Multi-asset" />
            <div className={styles.cardOneText}><h1>Multi-asset <br/> support:<br /></h1>
              <p>Crypto, stablecoins, <br/> flat, & mobile money</p>
              <span><a href="#"> &rarr; Read more</a></span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.card1}`}>
            <img src={img3} alt="Cross-chain" />
            <div className={styles.cardOneText}><h1>Cross-chain <br/> payments:<br /></h1>
              <p>Hedera, ethereum,<br/> BNB chain, solana.</p>
              <span><a href="#"> &rarr; Read more</a></span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.card1}`}>
            <img src={img4} alt="Sub-10s" />
            <div className={styles.cardOneText}><h1>Sub-10s <br/> settlement:<br /></h1>
              <p>Hedera consensus <br/> layer.</p>
              <span><a href="#"> &rarr; Read more</a></span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.card1}`}>
            <img src={img5} alt="Africa" />
            <div className={styles.cardOneText}><h1>Built for <br/> Africa & <br/> beyond<br /></h1>
              <p>Local stablecoins + <br/> mobile money <br/> integrations.</p>
              <span><a href="#"> &rarr; Read more</a></span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Allupay */}
      <section className={styles.whyTrustSection}>
        <h2>Why Trust Allupay</h2>
         <div className={`${styles.cardsRow} ${styles.cardsRow2}`}>
              <div className={`${styles.card} ${styles.card2}`}>
                  <img src={img7} alt="Freelancer" />
            <div className={styles.cardTwoText}>
              <p>Freelancer receiving <br/> payment</p>
                    <span><a href="#"> &rarr; Read more</a></span>
                  </div>
             </div>
            <div className={`${styles.card} ${styles.card2}`}>
                  <img src={img8} alt="SME" />
                  <div className={styles.cardTwoText}>
                    <p>SME sending bulk<br/>  payout</p>
                    <span><a href="#"> &rarr; Read more</a></span>
                  </div>
           </div>
           <div className={`${styles.card} ${styles.card2}`}>
                  <img src={img9} alt="Merchant" />
            <div className={styles.cardTwoText}>
              <p>Merchant integrating <br/> global transaction</p>
                    <span><a href="#"> &rarr; Read more</a></span>
                  </div>
           </div>
        </div>
        <p className={styles.trustDesc}>Our Hedera-powered system is designed to make payments fast, secure,<br/> transparent and borderless. Whether it’s cross-border remittances, merchant <br/> payments, or real-time FX conversion, you’ll always enjoy full transparency on fees, <br/> instant settlements and complete flexibility across assets</p>
        <button className={styles.learnMoreBtn}>Learn More</button>
      </section>

      {/* Seamless Payment Platform */}
      <section className={styles.seamlessSection}>
        <h2>Enjoy the most seamless payment platform</h2>
        <div className={`${styles.cardsRow} ${styles.cardsRow3}`}>
                  
                  <div className={`${styles.card} ${styles.card3}`}>
                    <img src={img10} alt="Compliance" />
                    <div className={styles.cardThreeText}>Regulatory-grade <br/> compliances:<br />
                      <span>AML/KYC, GDPR, PCI-DSS</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.card} ${styles.card3}`}>
                    <img src={img11} alt="API" />
                    <div className={styles.cardThreeText}>Developer-friendly API:<br />
                      <span>Plug-and-play SDKs for <br/> instant integrations</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.card} ${styles.card3}`}>
                    <img src={img12} alt="Africa-first" />
                    <div className={styles.cardThreeText}>Africa-first-design:<br />
                      <span>Local stablecoins + <br/> mobile money integration</span>
                    </div>
                  </div>        
        </div>
        <div className={styles.cardFourText}>
              <p>Enjoy a new world of payments with our multi-chain gateway that bridges </p> 
              <p>crypto, stablecoins, mobile money and flat into a single, seamless platform.</p> 
              <p>No borders, No delays, Just next-generation payment</p>
        </div>
        <button className={styles.getStartedBtn}>Get Started</button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
                      <div className={styles.footerLogo}>Allupay</div>
                      <div className={styles.footerLinks}>
                            <ul>
                              <li><a href="#">About Us</a></li>
                              <li><a href="#">Team</a></li>
                              <li><a href="#">Roadmap</a></li>
                              <li><a href="#">Contact Us</a></li>
                              <li><a href="#">Reports</a></li>
                              <li><a href="#">Blog</a></li>
                            </ul>
                            <ul>
                              <li><a href="#">Products and Services</a></li>
                              <li><a href="#">Use Case</a></li>
                              <li><a href="#">Case Studies</a></li>
                              <li><a href="#">Others</a></li>
                              <li><a href="#">Community</a></li>
                              <li><a href="#">FAQs</a></li>
                              </ul>
                            <ul>
                              <li><a href="#">Developers</a></li>
                              <li><a href="#">Hedera Network</a></li>
                              <li><a href="#">Dev Hub</a></li>
                              <li><a href="#">API References</a></li>
                            </ul>
                      </div>
        </div>
        <div className={styles.footerBottom}>
          <span>Privacy & Policy</span>
          <span>Terms And Conditions</span>
          <span>English</span>
          <span>2025</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;