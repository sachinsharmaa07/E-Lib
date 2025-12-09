import { useScrollReveal } from "../hooks/useScrollReveal.jsx";

function SectionWrapper({ children, className = "", variant = "fade-section" }) {
  const { ref, isVisible } = useScrollReveal();
  const classes = `${variant} ${isVisible ? "visible" : ""} ${className}`;

  return (
    <section ref={ref} className={classes}>
      {children}
    </section>
  );
}

export default SectionWrapper;
