import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import temperatureData from "../temperatureData.json";
import "./ScrollTemperature.css";

export default function ScrollTemperature() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Get temperature range
  const minTemp = temperatureData[0].temp;
  const maxTemp = temperatureData[temperatureData.length - 1].temp;

  // State for displaying values
  const [displayYear, setDisplayYear] = useState(1981);
  const [displayTemp, setDisplayTemp] = useState(minTemp);

  // Animate temperature as user scrolls
  const tempProgress = useTransform(scrollYProgress, [0.2, 0.8], [minTemp, maxTemp]);
  const yearProgress = useTransform(scrollYProgress, [0.2, 0.8], [1981, 2024]);

  // Update display values
  useMotionValueEvent(tempProgress, "change", (latest) => {
    setDisplayTemp(latest);
  });

  useMotionValueEvent(yearProgress, "change", (latest) => {
    setDisplayYear(latest);
  });

  // Background color gets warmer as you scroll
  const bgColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(15, 15, 30)", "rgb(80, 10, 10)"]
  );

  return (
    <motion.div
      ref={containerRef}
      className="scroll-temp-container"
      style={{ backgroundColor: bgColor }}
    >
      <div className="scroll-temp-content">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="scroll-temp-title">Scroll to See the Change</h2>
          <p className="scroll-instruction">As you scroll, watch Kolkata's temperature rise over time</p>

          <div className="temp-display">
            <div className="year-display">
              {Math.round(displayYear)}
            </div>
            <div className="temp-value">
              {displayTemp.toFixed(1)}°C
            </div>
          </div>

          <div className="heat-indicators">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="heat-wave"
                style={{
                  opacity: useTransform(scrollYProgress, [0.1 + i * 0.15, 0.3 + i * 0.15], [0, 0.6]),
                  scaleY: useTransform(scrollYProgress, [0.1 + i * 0.15, 0.3 + i * 0.15], [0.5, 1.5])
                }}
              />
            ))}
          </div>

          <motion.p
            className="impact-text"
            style={{
              opacity: useTransform(scrollYProgress, [0.6, 0.8], [0, 1])
            }}
          >
            This warming intensifies flooding, heat stress, and threatens millions in Kolkata
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
