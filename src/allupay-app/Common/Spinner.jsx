import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner({ size = 'small' }) {
  return <div className={`${styles.spinner} ${styles[size]}`}></div>;
}