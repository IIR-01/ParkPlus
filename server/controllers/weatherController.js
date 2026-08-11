// Weather Controller — F22
// Calls OpenWeatherMap API server-side and returns simplified data

const ALERT_CONDITIONS = ['Rain', 'Thunderstorm', 'Snow', 'Extreme', 'Drizzle'];

// -------------------------------------------------------
// @route   GET /api/weather
// @desc    Fetch current weather for the park's location
// @access  Private (any logged-in user)
// -------------------------------------------------------
const getWeather = async (req, res) => {
  try {
    const lat = process.env.PARK_LAT;
    const lon = process.env.PARK_LON;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      // Graceful fallback — never crash the app if the weather API is down
      return res.json({
        available: false,
        condition: 'Unavailable',
        temp: null,
        description: 'Weather data temporarily unavailable',
        isAlert: false,
      });
    }

    const data = await response.json();
    const condition = data.weather?.[0]?.main || 'Unknown';
    const description = data.weather?.[0]?.description || '';
    const temp = data.main?.temp ?? null;
    const isAlert = ALERT_CONDITIONS.includes(condition);

    res.json({
      available: true,
      condition,
      description,
      temp,
      isAlert,
    });
  } catch (error) {
    // Network failure, DNS failure, etc — still respond gracefully
    res.json({
      available: false,
      condition: 'Unavailable',
      temp: null,
      description: 'Weather data temporarily unavailable',
      isAlert: false,
    });
  }
};

module.exports = { getWeather };