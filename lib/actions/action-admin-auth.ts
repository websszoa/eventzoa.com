"use server";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("관리자 비밀번호가 설정되지 않았습니다.");
  }

  return password === adminPassword;
}
