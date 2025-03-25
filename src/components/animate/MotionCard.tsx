'use client';

import React, { useState } from 'react';
import { motion, useSpring, useMotionTemplate, transform } from 'framer-motion';

const MotionCard: React.FC = () => {
  const [frame, setFrame] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const rotateValue = 15;
  const transformValue = rotateValue * 2;
  const springConfig = { stiffness: 400, damping: 30 };

  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const shadowX = useSpring(0, springConfig);
  const shadowY = useSpring(30, springConfig);

  const filter = useMotionTemplate`
drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0, 0, 68, 0.25))`;

  const convertCursorPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    const objectX = (e.clientX - frame.left) / frame.width;
    const objectY = (e.clientY - frame.top) / frame.height;

    rotateX.set(transform(objectY, [0, 1], [rotateValue, -rotateValue]));
    rotateY.set(transform(objectX, [0, 1], [-rotateValue, rotateValue]));
    x.set(transform(objectX, [0, 1], [-transformValue, transformValue]));
    y.set(transform(objectY, [0, 1], [-transformValue, transformValue]));

    shadowX.set(transform(objectX, [0, 1], [20, -20]));
    shadowY.set(transform(objectY, [0, 1], [60, 20]));
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFrame({ width: rect.width, height: rect.height, top: rect.top, left: rect.left });
    convertCursorPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    convertCursorPosition(e);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    shadowX.set(0);
    shadowY.set(40);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-96 h-96 cursor-pointer"
      >
        <motion.div
          style={{ rotateX, rotateY }}
          className="w-96 h-96 rounded-2xl flex items-center justify-center bg-gradient-to-b from-cyan-400 to-indigo-400 shadow-lg"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ x, y, filter }}
            width="128"
            height="128"
            viewBox="0 0 256 256"
          >
            <path
              d="M113.14 26.767c4.175-6.958 14.86-3.998 14.86 4.116v50.784a7 7 0 007 7h78.87c6.219 0 10.06 6.783 6.86 12.116l-77.87 129.784c-4.175 6.957-14.86 3.998-14.86-4.116v-50.784a7 7 0 00-7-7H42.13c-6.219 0-10.06-6.784-6.86-12.116z"
              fill="#FFF"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MotionCard;
