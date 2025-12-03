import { motion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import TemperatureChart from "./components/TemperatureChart";
import ScrollTemperature from "./components/ScrollTemperature";
import RainfallChart from "./components/RainfallChart";
import ScrollRainfall from "./components/ScrollRainfall";
import temperatureData from "./temperatureData.json";
import rainfallData from "./rainfallData.json";

export default function App() {
  const { scrollYProgress } = useScroll();

  // Fade + slide movement on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Calculate actual temperature increase from data (comparing first decade to last decade)
  const firstDecade = temperatureData.slice(0, 10);
  const lastDecade = temperatureData.slice(-10);
  const avgFirst = firstDecade.reduce((sum, d) => sum + d.temp, 0) / firstDecade.length;
  const avgLast = lastDecade.reduce((sum, d) => sum + d.temp, 0) / lastDecade.length;
  const actualTempIncrease = (avgLast - avgFirst).toFixed(2);

  // Calculate rainfall change (excluding 1981)
  const rainfallFiltered = rainfallData.filter(d => d.year !== 1981);
  const firstDecadeRain = rainfallFiltered.slice(0, 10);
  const lastDecadeRain = rainfallFiltered.slice(-10);
  const avgFirstRain = firstDecadeRain.reduce((sum, d) => sum + d.rainfall, 0) / firstDecadeRain.length;
  const avgLastRain = lastDecadeRain.reduce((sum, d) => sum + d.rainfall, 0) / lastDecadeRain.length;
  const rainfallChange = ((avgLastRain - avgFirstRain) / avgFirstRain * 100).toFixed(1);

  return (
    <div className="container">

      {/* HERO SECTION */}
      <section className="hero">
        <motion.div style={{ opacity, y }}>
          <h1 className="title">Climate Change and Kolkata</h1>
          <p className="subtitle">
            A personal look at how rising heat and flooding threaten the city my family calls home.
          </p>
        </motion.div>
      </section>

      {/* WHY SECTION */}
      <section className="panel">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="panel-content"
        >
          <h2>My “Why”</h2>
          <p>
            Kolkata, India has always been a second home for me — a place filled with family,
            memories, and culture. But climate change is hitting the city hard: hotter summers,
            rising floodwaters, overwhelmed drainage systems, and dangerous heatwaves.
          </p>
          <p>
            Climate change matters to me because these impacts directly threaten the people and
            places I care about most.
          </p>
        </motion.div>
      </section>

      {/* SCROLL-DRIVEN TEMPERATURE SECTION */}
      <ScrollTemperature />

      {/* DATA SECTION */}
      <section className="panel dark">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="panel-content"
        >
          <h2>What the Data Shows</h2>
          <p className="data-highlight">
            Kolkata has warmed by <strong>+1.29°C</strong> since the early 1980s.
          </p>
          <p>
            Based on NASA satellite data from 1981-2024, the annual average temperature in Kolkata
            has risen from approximately <strong>25.9°C</strong> in the 1980s to <strong>26.5°C</strong> in recent years.
            This rapid warming worsens both flooding and heat stress. Higher temperatures intensify
            monsoon rainfall and raise humidity, making the city's already aging drainage system even more
            vulnerable.
          </p>
          <a
            href="https://power.larc.nasa.gov/data-access-viewer/"
            target="_blank"
            rel="noreferrer"
            className="source-link"
          >
            Data Source: NASA POWER Project
          </a>
        </motion.div>
      </section>

      {/* TEMPERATURE CHART SECTION */}
      <TemperatureChart />

      {/* SCROLL-DRIVEN RAINFALL SECTION */}
      <ScrollRainfall />

      {/* RAINFALL DATA SECTION */}
      <section className="monsoon-panel">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="image-overlay"
        >
          <h2>Intensifying Monsoons</h2>
          <p className="data-highlight">
            Rainfall patterns have shifted by <strong>+{rainfallChange}%</strong> since the 1980s.
          </p>
          <p>
            While yearly rainfall totals fluctuate naturally, the data shows a trend toward more intense
            monsoon events. Higher temperatures mean the atmosphere can hold more moisture, leading to
            heavier downpours that overwhelm Kolkata's drainage infrastructure. This creates devastating
            urban flooding even during moderate rainfall events.
          </p>
        </motion.div>
      </section>

      {/* RAINFALL CHART SECTION */}
      <RainfallChart />

      {/* VISUAL IMPACT SECTION */}
      <section className="image-panel">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
          className="image-overlay"
        >
          <h2>Flooding in Kolkata</h2>
          <p>
            As sea levels rise and storms intensify, neighborhoods flood more frequently — sometimes
            even after a short period of rainfall.
          </p>
        </motion.div>
      </section>

      {/* SUPERPOWER SECTION */}
      <section className="panel">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="panel-content"
        >
          <h2>My Climate Superpower</h2>
          <p>
            I use my skills in software engineering and data visualization to tell climate stories
            clearly and powerfully. This interactive app is one example of how I can turn data into
            something meaningful and engaging.
          </p>
        </motion.div>
      </section>

      {/* FINAL MESSAGE */}
      <section className="end-panel">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2>We All Have a Role</h2>
          <p>
            Climate action doesn’t have to be huge. Small steps — conversations, storytelling,
            creative projects — lead to bigger change.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
