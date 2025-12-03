import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import rainfallData from "../rainfallData.json";
import "./ScrollRainfall.css";

export default function ScrollRainfall() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Filter out 1981
  const filteredData = rainfallData.filter(d => d.year !== 1981);

  // Get rainfall range
  const minRainfall = Math.min(...filteredData.map(d => d.rainfall));
  const maxRainfall = Math.max(...filteredData.map(d => d.rainfall));

  // State for displaying values
  const [displayYear, setDisplayYear] = useState(1982);
  const [displayRainfall, setDisplayRainfall] = useState(minRainfall);

  // Animate rainfall as user scrolls
  const rainfallProgress = useTransform(scrollYProgress, [0.2, 0.8], [minRainfall, maxRainfall]);
  const yearProgress = useTransform(scrollYProgress, [0.2, 0.8], [1982, 2024]);

  // Update display values
  useMotionValueEvent(rainfallProgress, "change", (latest) => {
    setDisplayRainfall(latest);
  });

  useMotionValueEvent(yearProgress, "change", (latest) => {
    setDisplayYear(latest);
  });

  // Background gets more intense blue as you scroll
  const bgColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(10, 15, 25)", "rgb(15, 40, 80)"]
  );

  return (
    <motion.div
      ref={containerRef}
      className="scroll-rainfall-container"
      style={{ backgroundColor: bgColor }}
    >
      <div className="scroll-rainfall-content">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="scroll-rainfall-title">Scroll to See Rainfall Changes</h2>
          <p className="scroll-rainfall-instruction">
            Watch how monsoon patterns have shifted over the decades
          </p>

          <div className="rainfall-display">
            <div className="rainfall-year-display">
              {Math.round(displayYear)}
            </div>
            <div className="rainfall-value">
              15.18 mm/day
            </div>
            <div className="rainfall-subtitle">
              (total annual)
            </div>
          </div>

          <div className="water-droplets">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="water-droplet"
                style={{
                  opacity: useTransform(scrollYProgress, [0.1 + i * 0.1, 0.3 + i * 0.1], [0, 0.8]),
                  scale: useTransform(scrollYProgress, [0.1 + i * 0.1, 0.5 + i * 0.1], [0.5, 1.5]),
                  left: `${10 + i * 12}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
