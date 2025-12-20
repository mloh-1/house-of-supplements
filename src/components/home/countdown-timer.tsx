"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const timeUnits = [
    { value: timeLeft.days, label: "DANA" },
    { value: timeLeft.hours, label: "SATI" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEK" },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 md:gap-4">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="relative bg-black border border-zinc-800 px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[90px]">
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-lime/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-lime/50" />
                <div className="font-display text-3xl md:text-5xl text-lime text-center leading-none">
                  00
                </div>
                <div className="text-[10px] md:text-xs text-zinc-500 text-center mt-1 uppercase tracking-wider font-bold">
                  {unit.label}
                </div>
              </div>
            </div>
            {index < timeUnits.length - 1 && (
              <div className="text-lime text-2xl md:text-4xl font-bold opacity-50">:</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-3 md:gap-4">
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-lime/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Main container */}
            <div className="relative bg-black border border-zinc-800 group-hover:border-lime/50 transition-colors px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[90px]">
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-lime/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-lime/50" />

              {/* Value */}
              <div className="font-display text-3xl md:text-5xl text-lime text-center leading-none">
                {formatNumber(unit.value)}
              </div>

              {/* Label */}
              <div className="text-[10px] md:text-xs text-zinc-500 text-center mt-1 uppercase tracking-wider font-bold">
                {unit.label}
              </div>
            </div>
          </div>

          {/* Separator */}
          {index < timeUnits.length - 1 && (
            <div className="text-lime text-2xl md:text-4xl font-bold opacity-50">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
