import { useScrollReveal } from "../hooks/useScrollReveal.jsx";

export default function SectionWrapper({ children, className, variant = "fade-section" }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`${variant} ${isVisible ? "visible" : ""} ${className || ""}`}>
      {children}
    </section>
  );
}
