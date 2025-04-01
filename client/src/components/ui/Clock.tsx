import { useState, useEffect } from 'react';
import { format } from 'date-fns';

type ClockProps = {
  className?: string;
};

const Clock = ({ className = '' }: ClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={`text-2xl font-medium ${className}`}>
      {format(time, 'h:mm:ss a')}
    </div>
  );
};

export default Clock;
