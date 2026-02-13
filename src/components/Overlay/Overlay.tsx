import styles from './Overlay.module.css';
import type { OverlayProps } from '../../types';

export const Overlay = ({ onClose }: OverlayProps) => {
  return (
    <div className={styles.overlay} onClick={onClose} />
  );
};