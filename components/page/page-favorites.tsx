"use client";

import { Heart } from "lucide-react";

export default function PageFavorites() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 text-center py-20">
      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2 font-paperlogy">
        즐겨찾기가 없습니다
      </h3>
      <p className="text-gray-500 font-nanumNeo text-sm mb-6">
        관심 있는 이벤트를 추가해보세요.
      </p>
    </div>
  );
}
