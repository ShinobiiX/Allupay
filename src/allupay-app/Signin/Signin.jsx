import styles from './Signin.module.css';

function Signin() {
  return (
    <div className={styles.signin_container}>
      <form className={styles.signin_form}>
        <h2 className={styles.signin_title}>Signin to Allupay</h2>
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />
        <div className={styles.forgot_password}><a href="#">Forgot Password</a></div>
        <button type="submit" className={styles.login_btn}>Login</button>
        <div className={styles.signup_text}>
          Don’t have account? <a href="#" className={styles.signup_link}>Sign Up</a>
        </div>
        <div className={styles.divider_container}>
          <hr className={styles.divider} />
          <span className={styles.or_text}>Or</span>
          <hr className={styles.divider} />
        </div>
        <button type="button" className={styles.google_btn}>
          <span className={styles.google_icon}>G</span> Sign in with Google
        </button>
      </form>
    </div>
  );
}

export default Signin;