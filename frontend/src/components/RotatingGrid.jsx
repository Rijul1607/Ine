import React, { useState, useEffect } from "react";
import {  Home, Star, Heart, Bell, Camera, Cloud } from "lucide-react";

const icons = [Home, Star, Heart, Bell, Camera, Cloud];

export default function BlockShifter() {
  const [blocks, setBlocks] = useState(icons);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const newBlocks = [...prev];
        newBlocks.pop(); // remove last
        newBlocks.unshift(icons[Math.floor(Math.random() * icons.length)]); // new at first
        return newBlocks;
      });
    }, 2000); // change every 2s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 ">
      {blocks.map((Icon, idx) => (
        <div
          key={idx}
          className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-xl shadow-md transition-all"
        >
          <Icon size={32} />
        </div>
      ))}
    </div>
  );
}
