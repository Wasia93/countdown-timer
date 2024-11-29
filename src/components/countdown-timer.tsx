"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    const parsedDuration = typeof duration === "number" ? duration : parseInt(String(duration), 10);
    if (parsedDuration > 0) {
      setTimeLeft(parsedDuration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsActive(false);
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : parseInt(String(duration), 10) || 0);
    if (timerRef.current) {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url('https://wallpapercave.com/wp/wp3503158.jpg')`,
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold italic text-center mb-6">Countdown Timer</h1>
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="w-full px-4 py-2 border border-white-300 rounded-md text-white-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSetDuration}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Set Duration
          </Button>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-6xl font-extrabold">{formatTime(timeLeft)}</h2>
        </div>

        <div className="flex justify-between mt-6 gap-2">
          <Button
            onClick={handleStart}
            disabled={isActive}
            className={`flex-1 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md transition ${
              isActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Start
          </Button>
          <Button
            onClick={handlePause}
            disabled={!isActive}
            className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md transition ${
              !isActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
