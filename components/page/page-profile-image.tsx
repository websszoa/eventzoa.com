"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDisplayName, getAvatarUrl } from "@/lib/utils";
import { Camera, Pencil, Check, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PageProfileImageProps {
  user: User;
}

export default function PageProfileImage({ user }: PageProfileImageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const userMetadata = user.user_metadata;
  const avatarUrl = getAvatarUrl(userMetadata, "/face/face01.png");
  const displayName = getDisplayName(userMetadata);

  // 이미지 목록 생성
  const faceImages = Array.from({ length: 10 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/face/face${num}.png`;
  });

  // 이미지 선택하기
  const handleImageSelect = async (imagePath: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: imagePath,
        },
      });

      if (error) throw error;

      toast.success("프로필 이미지가 변경되었습니다.");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "에러 발생";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 이름 수정 시작
  const handleStartEditName = () => {
    setNameValue(displayName);
    setIsEditingName(true);
  };

  // 이름 저장하기
  const handleSaveName = async () => {
    if (!nameValue.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (nameValue.trim() === displayName) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);

    try {
      // 이름 업데이트
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: nameValue.trim(),
        },
      });

      if (error) throw error;

      toast.success("이름이 변경되었습니다.");
      setIsEditingName(false);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "에러 발생";
      toast.error(errorMessage);
    } finally {
      setIsSavingName(false);
    }
  };

  // 이름 수정 취소
  const handleCancelEditName = () => {
    setNameValue(displayName);
    setIsEditingName(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <div
          className="relative w-20 h-20 rounded-full bg-red-100 flex items-center justify-center overflow-hidden cursor-pointer group"
          onClick={() => setIsDialogOpen(true)}
        >
          <Image
            src={avatarUrl}
            alt="프로필 이미지"
            width={100}
            height={100}
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="font-paperlogy text-base md:text-xl text-gray-900 flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <Input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="text-xl font-paperlogy"
                disabled={isSavingName}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveName();
                  } else if (e.key === "Escape") {
                    handleCancelEditName();
                  }
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveName}
                disabled={isSavingName}
              >
                <Check />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEditName}
                disabled={isSavingName}
              >
                <X />
              </Button>
            </div>
          ) : (
            <>
              {displayName}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEditName}
                className="h-7 w-7 rounded-full p-0 bg-gray-100 hover:bg-gray-200"
              >
                <Pencil />
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-nanumNeo">
              프로필 이미지 선택
            </DialogTitle>
            <DialogDescription className="font-nanumNeo">
              원하는 이미지를 선택해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-4 py-4">
            {faceImages.map((imagePath, index) => (
              <Button
                key={imagePath}
                variant="outline"
                onClick={() => handleImageSelect(imagePath)}
                disabled={isLoading}
                className="relative aspect-square rounded-full overflow-hidden border-2 hover:border-red-500 transition-colors p-0 h-auto"
              >
                <Image
                  src={imagePath}
                  alt={`Face ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
