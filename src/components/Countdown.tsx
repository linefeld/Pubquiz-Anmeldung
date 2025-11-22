import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Clock } from 'lucide-react';

interface CountdownProps {
  deadline: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ deadline }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = deadline.getTime() - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-purple-600" />
        <h2 className="text-purple-900">Anmeldeschluss</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-900">{timeLeft.days}</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">Tage</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-900">{timeLeft.hours}</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">Stunden</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-900">{timeLeft.minutes}</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">Minuten</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-900">{timeLeft.seconds}</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">Sekunden</div>
        </div>
      </div>
      
      <p className="text-center mt-4 text-sm sm:text-base text-gray-600">
        bis zum 31. Dezember 2025, 23:59 Uhr
      </p>
    </Card>
  );
}
