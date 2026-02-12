import React from 'react'
import styles from './Overlay.module.css'

export const Overlay = ({onClose}) => {
  return (
    <div className={styles.overlay} onClick={() => onClose()}></div>
  )
}