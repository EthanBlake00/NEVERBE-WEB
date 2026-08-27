"use client";
import React from "react";
import { Lottie } from "lottie-react";
import { SuccessAnimation } from "@/assets/animation";

const SuccessAnimationComponents = () => {
  return (
    <figure className="flex justify-center mb-6">
      <Lottie
        animationData={SuccessAnimation}
        loop={false}
        className="w-24 h-24 md:w-32 md:h-32"
      />
    </figure>
  );
};

export default SuccessAnimationComponents;
