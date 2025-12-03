import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import rainfallData from "../rainfallData.json";
import "./RainfallChart.css";

export default function RainfallChart() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  });

  // Filter out 1981
  const filteredData = rainfallData.filter(d => d.year !== 1981);

  // Calculate rainfall change
  const firstDecade = filteredData.slice(0, 10);
  const lastDecade = filteredData.slice(-10);
  const avgFirst = firstDecade.reduce((sum, d) => sum + d.rainfall, 0) / firstDecade.length;
  const avgLast = lastDecade.reduce((sum, d) => sum + d.rainfall, 0) / lastDecade.length;
  const rainfallChange = (avgLast - avgFirst).toFixed(2);
  const isIncrease = rainfallChange > 0;

  // Show every 2nd year for cleaner viz
  const dataToShow = filteredData.filter((_, i) => i % 2 === 0);

  return (
    <div ref={containerRef} className="rainfall-chart-container">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="rainfall-content"
      >
        <h2>Kolkata's Changing Rainfall Patterns</h2>
        <p className="rainfall-change">
          Total annual rainfall has {isIncrease ? 'increased' : 'decreased'} by{" "}
          <strong className="highlight-rainfall">
            {isIncrease ? '+' : ''}{rainfallChange} mm/day
          </strong>{" "}
          from 1982 to 2024
        </p>

        <div className="rainfall-chart-wrapper">
          <div className="rainfall-chart-labels">
            <span className="rainfall-label">80</span>
            <span className="rainfall-label">55</span>
            <span className="rainfall-label">30</span>
          </div>
          <div className="rainfall-chart">
            {dataToShow.map((data, index) => {
              // Scale for rainfall visualization (total yearly rainfall)
              const scaleMin = 30;
              const scaleMax = 80;

              // Calculate normalized height
              const rainfallRatio = (data.rainfall - scaleMin) / (scaleMax - scaleMin);
              const heightPercent = Math.max(5, Math.min(100, rainfallRatio * 100));

              // Blue gradient based on rainfall intensity
              const blue = Math.floor(100 + (rainfallRatio * 155));
              const green = Math.floor(150 + (rainfallRatio * 105));
              const red = Math.floor(50 + (rainfallRatio * 100));

              // Individual bar animation delay
              const barDelay = index * 0.02;

              return (
                <motion.div
                  key={data.year}
                  className="rainfall-bar-container"
                  initial={{ opacity: 0, scaleY: 0 }}
                  whileInView={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: barDelay, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div
                    className="rainfall-bar"
                    style={{
                      height: `${heightPercent}%`,
                      background: `linear-gradient(to top, rgb(${red}, ${green}, ${blue}), rgba(${red + 50}, ${green + 50}, ${blue}, 0.7))`,
                      transformOrigin: 'bottom',
                    }}
                  >
                    <span className="rainfall-label-hover">{data.rainfall} mm</span>
                  </div>
                  <span className="rainfall-year-label">{data.year}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <p className="rainfall-note">
          Data shows total annual rainfall in mm/day summed across all months (NASA POWER)
        </p>
      </motion.div>
    </div>
  );
}
