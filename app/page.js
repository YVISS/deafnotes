"use client";
import Webcam from "react-webcam";
import detectDevice from "@/utils/deteectDevice/detectDevice";

export default function Home() {
  detectDevice();
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <>
      <Webcam audio={false} videoConstraints={videoConstraints} />
      <button
        onClick={() => {
          const imageSrc = getScreenshot();
        }}
      ></button>
    </>
  );
}
