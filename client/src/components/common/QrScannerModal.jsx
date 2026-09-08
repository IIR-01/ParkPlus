import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const READER_ID = 'qr-reader-region';

const QrScannerModal = ({ onScanned, onClose }) => {
  const scannerRef = useRef(null);
  const startedRef = useRef(false);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const html5QrCode = new Html5Qrcode(READER_ID);
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (!cancelled) {
              onScanned(decodedText.trim().toUpperCase());
            }
          },
          () => {}
        );
        if (!cancelled) setStarting(false);
      } catch (err) {
        if (!cancelled) {
          setStarting(false);
          setError('Could not access the camera. Please allow camera permission, or use manual entry instead.');
        }
        startedRef.current = false;
      }
    };

    boot();

    return () => {
      cancelled = true;
      const instance = scannerRef.current;
      if (instance && instance.getState && instance.getState() === 2) {
        instance
          .stop()
          .then(() => instance.clear())
          .catch(() => {})
          .finally(() => {
            startedRef.current = false;
          });
      } else {
        startedRef.current = false;
      }
    };
  }, [onScanned]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>📷 Scan Ticket QR Code</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {starting && !error && <p style={styles.hint}>Starting camera…</p>}
        {!starting && !error && <p style={styles.hint}>Point the camera at the visitor's QR code</p>}
        <div id={READER_ID} style={styles.readerBox} />
        <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#fff', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '420px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  title: { margin: 0, fontSize: '1.15rem', color: '#1e293b' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b', lineHeight: 1 },
  hint: { color: '#64748b', fontSize: '0.875rem', margin: '0 0 1rem' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.7rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' },
  readerBox: { width: '100%', borderRadius: '10px', overflow: 'hidden', background: '#000', minHeight: '240px' },
  cancelBtn: { width: '100%', marginTop: '1.25rem', padding: '0.7rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
};

export default QrScannerModal;