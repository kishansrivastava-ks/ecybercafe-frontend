// src/components/common/Animated.jsx
import { motion } from "framer-motion";
import { animations } from "../../config/animations";

const Animated = ({
  children,
  animation = "fadeIn", // default animation
  delay = 0,
  duration,
  className = "",
  viewport = { once: true }, // default viewport option
  as = "div", // allows different HTML elements
}) => {
  // Get animation configuration
  const selectedAnimation =
    typeof animation === "string" ? animations[animation] : animation;

  // Merge custom duration and delay with animation config
  const transition = {
    ...selectedAnimation.transition,
    ...(duration && { duration }),
    delay: delay,
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.whileInView}
      viewport={viewport}
      transition={transition}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default Animated;
