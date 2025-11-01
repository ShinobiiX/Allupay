import styles from './Signup.module.css';

function Signup() {
  return (
    <div className={styles.signup_container}>
      <form className={styles.signup_form}>
        <h2 className={styles.signup_title}>Sign Up to Allupay</h2>
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />
        <button type="submit" className={styles.login_btn}>Login</button>
        <div className={styles.login_text}>
          Already have account? <a href="#" className={styles.login_link}>Login</a>
        </div>
        <div className={styles.divider_container}>
          <hr className={styles.divider} />
          <span className={styles.or_text}>Or</span>
          <hr className={styles.divider} />
        </div>
        <button type="button" className={styles.google_btn}>
          <span className={styles.google_icon}>G</span> Sign up with Google
        </button>
      </form>
    </div>
  );
}

export default Signup;