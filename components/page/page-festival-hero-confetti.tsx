"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ConfettiPiece = {
  id: number;
  style: CSSProperties & {
    "--festival-confetti-drift": string;
    "--festival-confetti-rotation": string;
  };
};

const colors = [
  "#3b82f6",
  "#f59e0b",
  "#fb7185",
  "#34d399",
  "#8b5cf6",
  "#22d3ee",
  "#f472b6",
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createConfettiPieces() {
  return Array.from({ length: 16 }, (_, id): ConfettiPiece => {
    const size = randomBetween(6, 11);

    return {
      id,
      style: {
        left: `${randomBetween(2, 98)}%`,
        width: `${size}px`,
        height: `${randomBetween(size, size * 2)}px`,
        borderRadius: Math.random() > 0.55 ? "9999px" : "2px",
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${randomBetween(3.8, 8)}s`,
        animationDelay: `${randomBetween(-8, 0)}s`,
        "--festival-confetti-drift": `${randomBetween(-70, 70)}px`,
        "--festival-confetti-rotation": `${randomBetween(-540, 540)}deg`,
      },
    };
  });
}

export default function PageFestivalHeroConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPieces(createConfettiPieces());
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="festival-confetti"
          style={piece.style}
        />
      ))}
    </div>
  );
}
