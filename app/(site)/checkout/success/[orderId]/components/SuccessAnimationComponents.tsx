"use client";
import React from "react";
import dynamic from "next/dynamic";
import { SuccessAnimation } from "@/assets/animation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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
