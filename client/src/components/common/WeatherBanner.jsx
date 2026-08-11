import { useState, useEffect } from 'react';
import api from '../../utils/api';

const WeatherBanner = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const { data } = await api.get('/weather');
      setWeather(data);
    } catch (err) {
      // Silent fail — weather is a nice-to-have, never block the page
      setWeather(null);
    }
  };

  if (!weather || !weather.isAlert) return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>⛈️</span>
      <div>
        <p style={styles.title}>Weather Alert: {weather.condition}</p>
        <p style={styles.subtitle}>
          {weather.description} · {weather.temp}°C — consider heading to an indoor zone.
        </p>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    background: '#fef3c7',
    border: '1.5px solid #fbbf24',
    borderRadius: '10px',
    padding: '0.9rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '1.25rem',
  },
  icon: { fontSize: '1.75rem' },
  title: { margin: 0, fontWeight: 700, color: '#92400e' },
  subtitle: { margin: '0.15rem 0 0', color: '#92400e', fontSize: '0.875rem' },
};

export default WeatherBanner;