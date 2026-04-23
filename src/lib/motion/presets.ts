import type { Variants } from 'motion/react'

const easeOutExpo = [0.22, 1, 0.36, 1] as const

export const revealViewport = {
  once: true,
  amount: 0.14,
} as const

export const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeOutExpo },
  },
}

export const cardStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.06 },
  },
}

export const itemRevealVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: easeOutExpo },
  },
}

export const pageEnterVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
}
