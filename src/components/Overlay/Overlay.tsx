import type { OverlayProps } from '../../types';
import styles from './Overlay.module.css';

export const Overlay = ({ onClose }: OverlayProps) => {
  return (
    <div className={styles.overlay} onClick={onClose} />
  );
};