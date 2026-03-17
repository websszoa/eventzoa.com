"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import {
  Calendar,
  Camera,
  Eye,
  LogOut,
  Mail,
  Pencil,
  Shield,
  Trash2,
  UserIcon,
} from "lucide-react";

import DialogProfileImage from "@/components/dialog/dialog-profile-image";
import DialogProfileName from "@/components/dialog/dialog-profile-name";
import DialogProfileDelete from "@/components/dialog/dialog-profile-delete";

interface PageProfileInfoProps {
  profile: Profile | null;
}

export default function PageProfileInfo({ profile: initialProfile }: PageProfileInfoProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [profileImageOpen, setProfileImageOpen] = useState(false);
  const [profileNameOpen, setProfileNameOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const name = profile?.full_name ?? "-";
  const email = profile?.email ?? "-";
  const role = profile?.role === "admin" ? "관리자" : "일반회원";
  const createdAt = formatDate(profile?.created_at);
  const visitCount = profile?.visit_count ?? 0;
  const avatarUrl = profile?.avatar_url || "/face/face01.png";
  const signupProvider = profile?.signup_provider ?? "";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("로그아웃 되었습니다.");
    router.push("/");
  };

  const updateProfile = (nextProfile: Partial<Profile>) => {
    setProfile((currentProfile) =>
      currentProfile ? { ...currentProfile, ...nextProfile } : currentProfile,
    );
  };

  function getSignupProviderIcon(provider: string) {
    if (provider === "google") {
      return (
        <>
          <Image
            src="/svg/google.svg"
            alt=""
            width={18}
            height={18}
            className="shrink-0"
          />
          (구글로 가입)
        </>
      );
    }
    if (provider === "kakao") {
      return (
        <>
          <span className="bg-[#FFEB00] rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 21 21"
              className="shrink-0"
            >
              <path
                fill="#3C1E1E"
                d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"
              />
            </svg>
          </span>
          (카카오로 가입)
        </>
      );
    }
    return null;
  }

  return (
    <div className="contact__container">
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setProfileImageOpen(true)}
          className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center overflow-hidden cursor-pointer group"
        >
          <Image
            src={avatarUrl}
            alt="프로필"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>

        <div className="font-paperlogy text-base md:text-xl text-gray-900 flex items-center gap-2">
          {name}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-full p-0 bg-gray-100 hover:bg-gray-200"
            onClick={() => setProfileNameOpen(true)}
          >
            <Pencil />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4 mt-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-anyvid mb-1">
              이름
            </p>
            <p className="text-sm font-anyvid text-foreground">{name}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-anyvid mb-1">
              이메일
            </p>
            <p className="text-sm font-anyvid text-foreground break-all">
              {email}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-anyvid mb-1">
              역할
            </p>
            <p className="text-sm font-anyvid text-foreground">{role}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-anyvid mb-1">
              가입일
            </p>
            <p className="text-sm font-anyvid text-foreground inline-flex items-center gap-1.5">
              {createdAt}
              {getSignupProviderIcon(signupProvider)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-anyvid mb-1">
              방문횟수
            </p>
            <p className="text-sm font-anyvid text-foreground">
              {visitCount}회
            </p>
          </div>
        </div>

        <Separator />

        <div className="md:pt-2 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-normal text-muted-foreground hover:bg-green-50 hover:border-green-600 hover:text-green-700 font-anyvid transition-colors flex items-center gap-1"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-sm font-normal text-muted-foreground hover:bg-red-50 hover:border-red-300 hover:text-red-600 font-anyvid transition-colors flex items-center gap-1"
            onClick={() => setDeleteAccountOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            탈퇴하기
          </Button>
        </div>
      </div>

      <DialogProfileImage
        open={profileImageOpen}
        onOpenChange={setProfileImageOpen}
        currentImage={profile?.avatar_url}
        onUpdated={(newUrl) => updateProfile({ avatar_url: newUrl })}
      />

      <DialogProfileName
        open={profileNameOpen}
        onOpenChange={setProfileNameOpen}
        currentName={profile?.full_name}
        onUpdated={(newName) => updateProfile({ full_name: newName })}
      />

      <DialogProfileDelete
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
      />
    </div>
  );
}
