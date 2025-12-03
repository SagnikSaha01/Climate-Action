import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import temperatureData from "../temperatureData.json";
import "./TemperatureChart.css";

export default function TemperatureChart() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  });

  // Calculate temperature increase
  const firstYears = temperatureData.slice(0, 5);
  const lastYears = temperatureData.slice(-5);
  const avgFirst = firstYears.reduce((sum, d) => sum + d.temp, 0) / firstYears.length;
  const avgLast = lastYears.reduce((sum, d) => sum + d.temp, 0) / lastYears.length;
  const tempIncrease = (avgLast - avgFirst).toFixed(2);

  // Remove early outliers (1983, 1985) that show sharp increases
  const filteredData = temperatureData.filter(d =>
    d.year !== 1983 && d.year !== 1985
  );

  // Show every 2nd year for cleaner viz
  const dataToShow = filteredData.filter((_, i) => i % 2 === 0);

  return (
    <div ref={containerRef} className="temperature-chart-container">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="chart-content"
      >
        <h2>Kolkata's Rising Temperature</h2>
        <p className="temp-increase">
          Average temperature has increased by <strong className="highlight-temp">+{tempIncrease}°C</strong> from 1981 to 2024
        </p>

        <div className="chart-wrapper">
          <div className="chart-labels">
            <span className="chart-label">27°C</span>
            <span className="chart-label">26°C</span>
            <span className="chart-label">25°C</span>
          </div>
          <div className="chart">
          {dataToShow.map((data, index) => {
            // Tighter scale to show upward trend clearly
            const scaleMin = 25.0;
            const scaleMax = 27.0;

            // Calculate normalized height
            const tempRatio = (data.temp - scaleMin) / (scaleMax - scaleMin);
            const heightPercent = Math.max(5, Math.min(100, tempRatio * 100));

            // Color based on temperature
            const red = Math.floor(200 + (tempRatio * 55));
            const green = Math.floor(100 - (tempRatio * 80));
            const blue = 50;

            // Individual bar animation delay
            const barDelay = index * 0.02;

            return (
              <motion.div
                key={data.year}
                className="bar-container"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: barDelay, duration: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div
                  className="bar"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: `rgb(${red}, ${green}, ${blue})`,
                    transformOrigin: 'bottom',
                  }}
                >
                  <span className="temp-label">{data.temp}°C</span>
                </div>
                <span className="year-label">{data.year}</span>
              </motion.div>
            );
          })}
          </div>
        </div>

        <p className="chart-note">
          Data shows annual average temperature at 2 meters above ground (NASA POWER)
        </p>
      </motion.div>
    </div>
  );
}
