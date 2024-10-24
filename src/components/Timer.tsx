import React from 'react';

interface TimerProps {
  time: number;
}

const Timer: React.FC<TimerProps> = ({ time }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer text-center">
      <span className="text-5xl">{minutes < 10 ? `0${minutes}` : minutes}</span>
      {' : '}
      <span className="text-5xl">{seconds < 10 ? `0${seconds}` : seconds}</span>
      <p className="text-lg">min</p>
    </div>
  );
};

export default Timer;
