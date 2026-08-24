"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DropShadowProps {
  containerStyle?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: "light" | "dark";
}

const DropShadow = ({
  containerStyle,
  children,
  onClick,
}: DropShadowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`fixed inset-0 z-[100] flex bg-black/60 backdrop-blur-md transition-all ${containerStyle || ""}`}
    >
      {children}
    </motion.div>
  );
};

export default DropShadow;
