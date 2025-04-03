// src/config/animations.js

export const easings = {
  smooth: [0.4, 0, 0.2, 1],
  smoothOut: [0.0, 0, 0.2, 1],
  smoothIn: [0.4, 0, 1, 1],
  spring: { type: "spring", stiffness: 100, damping: 10 },
  bounce: { type: "spring", stiffness: 300, damping: 10 },
  gentle: [0.6, 0.01, -0.05, 0.95],
  elastic: { type: "spring", stiffness: 400, damping: 15 },
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.5 },
  },

  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: easings.smooth },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },

  slideLeft: {
    initial: { opacity: 0, x: -20 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },

  slideRight: {
    initial: { opacity: 0, x: 20 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },

  scale: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },

  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    whileInView: { opacity: 1, rotate: 0 },
    transition: { duration: 0.8 },
  },

  flip: {
    initial: { opacity: 0, rotateX: -180 },
    whileInView: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.8, ease: easings.spring },
  },

  swing: {
    initial: { opacity: 0, rotate: -60, originX: "50%", originY: 0 },
    whileInView: { opacity: 1, rotate: 0 },
    transition: { duration: 1, ease: easings.spring },
  },

  staggeredList: {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },

  cardFlip: {
    initial: {
      opacity: 0,
      rotateY: 180,
      scale: 0.8,
    },
    whileInView: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    },
  },

  bounceScale: {
    initial: { scale: 0 },
    whileInView: { scale: 1 },
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },

  revealText: {
    initial: {
      opacity: 0,
      y: 50,
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
    },
    whileInView: {
      opacity: 1,
      y: 0,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    },
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    },
  },

  grow: {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: easings.smooth },
    },
  },

  lift: {
    whileHover: {
      y: -5,
      transition: { duration: 0.2, ease: easings.smooth },
    },
  },

  pulse: {
    whileHover: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },

  shake: {
    whileHover: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  },

  popIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.3, ease: easings.smooth },
  },
};
