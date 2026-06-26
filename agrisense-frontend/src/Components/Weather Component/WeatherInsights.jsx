import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaCloudRain,
  FaTemperatureHigh,
  FaLightbulb,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function WeatherInsights() {
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [currentState, setCurrentState] = useState("");
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState({
    temperature: "--",
    humidity: "--",
    rainfall: "--",
    windSpeed: "--",
    condition: "Select location",
    icon: "☀️",
  });
  const [forecastDays, setForecastDays] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [lastUpdated, setLastUpdated] = useState("Just now");

  useEffect(() => {
    // load states once
    const fetchStates = async () => {
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: "India" }
        );
        const states = response.data.data.states.map((s) => s.name);
        setStateOptions(states);
        if (states.length) setSelectedState((prev) => prev || states[0]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    // load districts when state changes
    const fetchDistricts = async (stateName) => {
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          { country: "India", state: stateName }
        );
        setDistrictOptions(response.data.data || []);
        if (response.data.data?.length)
          setSelectedDistrict((prev) => prev || response.data.data[0]);
      } catch (e) {
        console.error(e);
      }
    };
    if (selectedState) fetchDistricts(selectedState);
  }, [selectedState]);

  const fetchCoordinates = async () => {
    if (!selectedDistrict) return null;
    try {
      const resp = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          selectedDistrict
        )}&count=1`
      );
      const result = resp.data.results?.[0];
      if (!result) return null;
      return { latitude: result.latitude, longitude: result.longitude };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const getCurrentCondition = (data) => {
    const rain = data?.daily?.precipitation_sum?.[0] ?? 0;
    const temp = data?.current?.temperature_2m ?? 0;
    if (rain > 8) return { condition: "Rainy", icon: "🌧️" };
    if (temp >= 35) return { condition: "Hot", icon: "☀️" };
    return { condition: "Pleasant", icon: "⛅" };
  };

  const mapDailyForecast = (data) => {
    if (!data?.daily?.time) return [];
    return data.daily.time.map((date, i) => {
      const max = Math.round(data.daily.temperature_2m_max[i]);
      const rain = Math.round(data.daily.precipitation_sum[i] ?? 0);
      const icon = rain > 5 ? "🌧️" : max >= 30 ? "☀️" : "⛅";
      return {
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        temp: `${max}°C`,
        rainfall: `${rain} mm`,
        icon,
      };
    });
  };

  const generateInsights = (data) => {
    const recs = [];
    const alts = [];
    const rainfall = data?.daily?.precipitation_sum?.[0] ?? 0;
    const humidity = data?.current?.relative_humidity_2m ?? 0;
    const temperature = data?.current?.temperature_2m ?? 0;

    if (rainfall > 20) {
      recs.push("Heavy rainfall expected. Delay fertilizer application.");
      alts.push("⚠️ Flooding risk due to heavy rainfall.");
    }
    if (humidity > 80) recs.push("High humidity detected. Monitor fungal diseases.");
    if (temperature > 35) alts.push("⚠️ High temperature may stress crops.");

    recs.push("Good week for irrigation planning.");

    setRecommendations(recs);
    setAlerts(alts);
  };

  const handleFetchWeather = async () => {
    const coords = await fetchCoordinates();
    if (!coords) return;

    try {
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7&timezone=auto`
      );
      const data = weatherResponse.data;
      setWeatherData(data);

      const cond = getCurrentCondition(data);
      setCurrentWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        rainfall: Math.round(data.daily.precipitation_sum[0] ?? 0),
        windSpeed: Math.round(data.current.wind_speed_10m || 0),
        condition: cond.condition,
        icon: cond.icon,
      });
      setCurrentState(selectedState);
      setCurrentDistrict(selectedDistrict);
      setForecastDays(mapDailyForecast(data));
      generateInsights(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = weatherData?.daily?.time
    ? weatherData.daily.time.map((date, i) => ({
        name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        temp: Math.round(weatherData.daily.temperature_2m_max[i] ?? 0),
        rain: Math.round(weatherData.daily.precipitation_sum[i] ?? 0),
        humidity: Math.round(weatherData.current?.relative_humidity_2m ?? 0),
      }))
    : [];

  // suitability helpers (0-100)
  const computeTempSuitability = (t) => {
    if (t == null) return 0;
    const idealMin = 20;
    const idealMax = 30;
    if (t >= idealMin && t <= idealMax) return 100;
    const distance = t < idealMin ? idealMin - t : t - idealMax;
    return Math.max(0, Math.round(100 - distance * 8));
  };

  const computeRainSuitability = (r) => {
    if (r == null) return 0;
    const idealMax = 10; // mm
    if (r <= idealMax) return 100;
    const distance = r - idealMax;
    return Math.max(0, Math.round(100 - distance * 4));
  };

  const tempSuitability = chartData.map((d) => ({ name: d.name, score: computeTempSuitability(d.temp) }));
  const rainSuitability = chartData.map((d) => ({ name: d.name, score: computeRainSuitability(d.rain) }));
  const avg = (arr) => (arr.length ? Math.round(arr.reduce((s, x) => s + x.score, 0) / arr.length) : 0);
  const avgTempSuit = avg(tempSuitability);
  const avgRainSuit = avg(rainSuitability);

  // disease risk: higher is worse (derived from humidity and rainfall)
  const computeDiseaseRisk = (h, r, t) => {
    const hum = h ?? 0;
    const rain = r ?? 0;
    const temp = t ?? 0;
    // humidity above 70 increases risk, rain increases risk, higher temps moderately increase
    const humFactor = hum > 70 ? (hum - 70) * 1.5 : 0;
    const rainFactor = rain * 3;
    const tempFactor = temp > 25 ? (temp - 25) * 1.2 : 0;
    return Math.max(0, Math.min(100, Math.round(humFactor + rainFactor + tempFactor)));
  };

  const diseaseRisk = chartData.map((d) => ({
    name: d.name,
    score: computeDiseaseRisk(d.humidity, d.rain, d.temp),
  }));
  const avgDiseaseRisk = diseaseRisk.length ? Math.round(diseaseRisk.reduce((s, x) => s + x.score, 0) / diseaseRisk.length) : 0;

  return (
    <div className="container" style={{ maxWidth: 1100 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-secondary mb-1">Weather Insights</p>
          <h1 className="h3 mb-0">Farm Weather Dashboard</h1>
        </div>
        <div className="text-end text-secondary small">
          <div>Last refreshed</div>
          <strong>{lastUpdated}</strong>
        </div>
      </div>

      <section className="mb-4">
        <div className="card rounded-4 shadow-sm p-4">
          <div className="d-flex align-items-center mb-3 gap-3">
            <FaMapMarkerAlt size={22} className="text-primary" />
            <div>
              <p className="mb-1 text-muted small">Farm Location</p>
              <h5 className="mb-0">Select your state and district</h5>
            </div>
          </div>

          <div className="row g-3 align-items-end">
            <div className="col-sm-4">
              <label className="form-label">State</label>
              <select
                className="form-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-4">
              <label className="form-label">District</label>
              <select
                className="form-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {districtOptions.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-4 d-grid">
              <button className="btn btn-primary" onClick={handleFetchWeather}>
                Fetch Weather
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div
          className="card rounded-4 shadow-sm bg-gradient p-4"
          style={{ background: "linear-gradient(135deg, #e9f7ff 0%, #d4f0ff 100%)" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="text-secondary mb-1">Current weather</p>
              <h2 className="display-5 mb-0">{currentWeather.temperature}°C</h2>
              <p className="mb-0 text-muted">{currentDistrict}, {currentState}</p>
            </div>
            <div className="text-end">
              <div className="fs-1">{currentWeather.icon}</div>
            </div>
          </div>

          <div className="row text-center text-sm-start">
            <div className="col-sm-3 mb-3 mb-sm-0">
              <strong>Humidity</strong>
              <div className="text-muted">{currentWeather.humidity}%</div>
            </div>
            <div className="col-sm-3 mb-3 mb-sm-0">
              <strong>Rainfall</strong>
              <div className="text-muted">{currentWeather.rainfall} mm</div>
            </div>
            <div className="col-sm-3 mb-3 mb-sm-0">
              <strong>Wind Speed</strong>
              <div className="text-muted">{currentWeather.windSpeed} km/h</div>
            </div>
            <div className="col-sm-3">
              <strong>Condition</strong>
              <div className="text-success">{currentWeather.condition}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">7 Day Forecast</h2>
        </div>

        <div className="row g-3">
          {forecastDays.map((forecast) => (
            <div key={forecast.day} className="col-6 col-sm-4 col-md-2">
              <div className="card rounded-4 shadow-sm h-100">
                <div className="card-body text-center py-3">
                  <div className="fw-semibold mb-2">{forecast.day}</div>
                  <div className="fs-3 mb-2">{forecast.icon}</div>
                  <div className="text-muted">{forecast.temp}</div>
                  <div className="text-muted small mt-1">{forecast.rainfall}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="h5 mb-3">Rainfall & Temperature Analytics</h2>
        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card rounded-4 shadow-sm p-3 h-100">
              <div className="d-flex align-items-center mb-3">
                <FaCloudRain className="me-2 text-primary" />
                <h3 className="h6 mb-0">Rainfall Trend</h3>
              </div>
              <div className="small text-muted mb-2">Irrigation planning</div>
              <div className="bg-light rounded-4 p-2" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#0d6efd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">Avg suitability</small>
                  <strong>{avgRainSuit}%</strong>
                </div>
                <div className="d-flex gap-2 mt-2 overflow-auto" style={{ paddingBottom: 6 }}>
                  {rainSuitability.map((r) => (
                    <div key={r.name} style={{ minWidth: 56 }}>
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${r.score}%` }}
                          aria-valuenow={r.score}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <div className="text-center small text-muted mt-1">{r.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card rounded-4 shadow-sm p-3 h-100">
              <div className="d-flex align-items-center mb-3">
                <FaTemperatureHigh className="me-2 text-danger" />
                <h3 className="h6 mb-0">Temperature Trend</h3>
              </div>
              <div className="small text-muted mb-2">Crop suitability</div>
              <div className="bg-light rounded-4 p-2" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#dc3545" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">Avg suitability</small>
                  <strong>{avgTempSuit}%</strong>
                </div>
                <div className="d-flex gap-2 mt-2 overflow-auto" style={{ paddingBottom: 6 }}>
                  {tempSuitability.map((t) => (
                    <div key={t.name} style={{ minWidth: 56 }}>
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{ width: `${t.score}%` }}
                          aria-valuenow={t.score}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <div className="text-center small text-muted mt-1">{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card rounded-4 shadow-sm p-3 h-100">
              <div className="d-flex align-items-center mb-3">
                <FaLightbulb className="me-2 text-warning" />
                <h3 className="h6 mb-0">Disease Risk</h3>
              </div>
              <div className="small text-muted mb-2">Disease risk (higher = more risk)</div>
              <div className="bg-light rounded-4 p-2" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="humidity" stroke="#ffc107" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">Avg risk</small>
                  <strong>{avgDiseaseRisk}%</strong>
                </div>
                <div className="d-flex gap-2 mt-2 overflow-auto" style={{ paddingBottom: 6 }}>
                  {diseaseRisk.map((d) => (
                    <div key={d.name} style={{ minWidth: 56 }}>
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className={`progress-bar ${d.score > 60 ? 'bg-danger' : 'bg-warning'}`}
                          role="progressbar"
                          style={{ width: `${d.score}%` }}
                          aria-valuenow={d.score}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <div className="text-center small text-muted mt-1">{d.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="card rounded-4 shadow-sm p-4">
          <div className="d-flex align-items-center mb-3">
            <FaLightbulb className="me-2 text-success" />
            <h2 className="h5 mb-0">AI Farming Recommendations</h2>
          </div>
          <ul className="list-group list-group-flush">
            {recommendations.map((item) => (
              <li key={item} className="list-group-item border-0 px-0 py-2">• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-4">
        <div className="card rounded-4 shadow-sm p-4 border-danger">
          <div className="d-flex align-items-center mb-3">
            <FaExclamationTriangle className="me-2 text-danger" />
            <h2 className="h5 mb-0">Alerts & Warnings</h2>
          </div>
          <div className="d-flex flex-column gap-2">
            {alerts.map((alert) => (
              <div key={alert} className="alert alert-danger py-2 mb-0 rounded-4">{alert}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WeatherInsights;
