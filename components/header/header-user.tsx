import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { getDisplayName, getAvatarUrl } from "@/lib/utils";

interface HeaderUserProps {
  user: User | null;
}

export default function HeaderUser({ user }: HeaderUserProps) {
  const userMetadata = user?.user_metadata;
  const avatarUrl = getAvatarUrl(userMetadata, "/face/face01.png");
  const displayName = getDisplayName(userMetadata, "이름 없음");

  return (
    <div className="p-4 border-b border-brand/5 bg-brand/5 mt-[-16px]">
      <div className="text-center py-2">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 border-brand/10 flex items-center justify-center overflow-hidden p-1">
            <Image
              src={avatarUrl}
              alt={user ? "프로필 이미지" : "랜덤 프로필 이미지"}
              width={80}
              height={80}
              className="w-full h-full object-cover bg-brand/10 rounded-full"
            />
          </div>
        </div>
        <h3 className="font-paperlogy font-bold text-lg text-gray-900 mb-1">
          {user ? `${displayName}님, 환영합니다!` : "방가워요! 환영합니다!"}
        </h3>
        <p className="font-nanumNeo text-sm text-gray-500 truncate mb-2">
          {user ? user.email : '"이벤트 일정을 한눈에 확인해보세요!"'}
        </p>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
          <span className="font-nanumNeo text-xs text-blue-600">
            이벤트 정보
          </span>
          <div className="w-2 h-2 bg-green-200 rounded-full ml-2"></div>
          <span className="font-nanumNeo text-xs text-green-600">커뮤니티</span>
          <div className="w-2 h-2 bg-purple-200 rounded-full ml-2"></div>
          <span className="font-nanumNeo text-xs text-purple-600">
            기록 관리
          </span>
        </div>
      </div>
    </div>
  );
}
