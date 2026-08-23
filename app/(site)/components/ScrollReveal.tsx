"use client";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  triggerStart?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  className = "",
  triggerStart = "top 85%",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getInitialProps = () => {
    switch (direction) {
      case "up":    return { y: 50, opacity: 0 };
      case "down":  return { y: -50, opacity: 0 };
      case "left":  return { x: 50, opacity: 0 };
      case "right": return { x: -50, opacity: 0 };
      case "fade":
      default:      return { opacity: 0 };
    }
  };

  const getAnimateProps = () => {
    switch (direction) {
      case "up":
      case "down":  return { y: 0, opacity: 1 };
      case "left":
      case "right": return { x: 0, opacity: 1 };
      case "fade":
      default:      return { opacity: 1 };
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const targets = stagger > 0
        ? containerRef.current.children
        : containerRef.current;

      gsap.set(targets, getInitialProps());

      gsap.to(targets, {
        ...getAnimateProps(),
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
