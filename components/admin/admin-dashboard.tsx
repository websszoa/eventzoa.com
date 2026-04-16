import Link from "next/link";
import { formatDate, getEventStatus } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DashboardEvent = {
  id: string;
  name: string;
  country: string;
  region: string;
  event_start_at: string | null;
  event_end_at: string | null;
  created_at: string;
};

type DashboardMember = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_deleted: boolean;
  created_at: string;
};

type DashboardContact = {
  id: string;
  message: string;
  status: "pending" | "progress" | "resolved" | "closed";
  admin_reply: string | null;
  created_at: string;
};

type Props = {
  events: DashboardEvent[];
  members: DashboardMember[];
  contacts: DashboardContact[];
};

export default function AdminDashboard({ events, members, contacts }: Props) {
  // 이벤트 통계
  const eventStats = events.reduce(
    (acc, e) => {
      const status = getEventStatus(e.event_start_at, e.event_end_at);
      if (status === "upcoming") acc.upcoming++;
      else if (status === "ongoing") acc.ongoing++;
      else acc.ended++;
      return acc;
    },
    { upcoming: 0, ongoing: 0, ended: 0 },
  );

  // 회원 통계
  const memberStats = members.reduce(
    (acc, m) => {
      if (m.is_deleted) acc.deleted++;
      else acc.active++;
      if (m.role === "admin") acc.admin++;
      return acc;
    },
    { active: 0, deleted: 0, admin: 0 },
  );

  // 문의 통계
  const contactStats = contacts.reduce(
    (acc, c) => {
      if (c.status === "pending") acc.pending++;
      else if (c.status === "progress") acc.progress++;
      else if (c.status === "resolved") acc.resolved++;
      else acc.closed++;
      return acc;
    },
    { pending: 0, progress: 0, resolved: 0, closed: 0 },
  );

  const recentEvents = events.slice(0, 5);
  const recentMembers = members.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy">대시보드</h1>
        <p className="text-sm text-muted-foreground font-anyvid mt-1">
          회원, 문의사항, 마라톤 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 현황 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {/* 이벤트 */}
        <Link href="/admin/event" className="bg-white border rounded-lg p-4 hover:border-brand/40 transition-colors">
          <p className="text-sm text-muted-foreground font-paperlogy mb-1">이벤트 현황</p>
          <p className="text-2xl font-semibold font-paperlogy mb-2">{events.length}<span className="text-sm font-normal text-muted-foreground ml-1">건</span></p>
          <div className="flex gap-3 text-xs font-anyvid text-muted-foreground">
            <span className="text-blue-600">예정 {eventStats.upcoming}</span>
            <span className="text-green-600">진행중 {eventStats.ongoing}</span>
            <span className="text-yellow-600">종료 {eventStats.ended}</span>
          </div>
        </Link>
        {/* 회원 */}
        <Link href="/admin/member" className="bg-white border rounded-lg p-4 hover:border-brand/40 transition-colors">
          <p className="text-sm text-muted-foreground font-paperlogy mb-1">회원 현황</p>
          <p className="text-2xl font-semibold font-paperlogy mb-2">{members.length}<span className="text-sm font-normal text-muted-foreground ml-1">명</span></p>
          <div className="flex gap-3 text-xs font-anyvid text-muted-foreground">
            <span className="text-green-600">활성 {memberStats.active}</span>
            <span className="text-red-600">탈퇴 {memberStats.deleted}</span>
            <span className="text-blue-600">관리자 {memberStats.admin}</span>
          </div>
        </Link>
        {/* 문의 */}
        <Link href="/admin/contact" className="bg-white border rounded-lg p-4 hover:border-brand/40 transition-colors">
          <p className="text-sm text-muted-foreground font-paperlogy mb-1">문의 현황</p>
          <p className="text-2xl font-semibold font-paperlogy mb-2">{contacts.length}<span className="text-sm font-normal text-muted-foreground ml-1">건</span></p>
          <div className="flex gap-3 text-xs font-anyvid text-muted-foreground">
            <span className="text-red-600">대기 {contactStats.pending}</span>
            <span className="text-yellow-600">처리중 {contactStats.progress}</span>
            <span className="text-green-600">해결 {contactStats.resolved}</span>
          </div>
        </Link>
      </div>

      {/* 최근 이벤트 / 최근 회원 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 최근 이벤트 */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold font-paperlogy text-muted-foreground flex items-center justify-between">
            최근 등록 이벤트
            <Link href="/admin/event" className="text-xs text-brand hover:underline underline-offset-4">
              전체 보기
            </Link>
          </h2>
          <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40px] text-center">No</TableHead>
                  <TableHead>이벤트명</TableHead>
                  <TableHead className="w-[75px] text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      등록된 이벤트가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentEvents.map((event, index) => {
                    const status = getEventStatus(event.event_start_at, event.event_end_at);
                    return (
                      <TableRow key={event.id} className="hover:bg-gray-50 text-muted-foreground">
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="truncate max-w-0">
                          <div className="truncate">{event.name}</div>
                          <div className="text-xs truncate">{event.region || "-"}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          {status === "upcoming" && <Badge variant="outline" className="text-blue-600 border-blue-200">예정</Badge>}
                          {status === "ongoing" && <Badge variant="green">진행중</Badge>}
                          {status === "ended" && <Badge variant="outline">종료</Badge>}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* 최근 회원 */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold font-paperlogy text-muted-foreground flex items-center justify-between">
            최근 가입 회원
            <Link href="/admin/member" className="text-xs text-brand hover:underline underline-offset-4">
              전체 보기
            </Link>
          </h2>
          <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40px] text-center">No</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead className="w-[75px] text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      등록된 회원이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentMembers.map((member, index) => (
                    <TableRow key={member.id} className="hover:bg-gray-50 text-muted-foreground">
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="truncate max-w-0">
                        <div className="truncate font-medium text-foreground">{member.full_name || "-"}</div>
                        <div className="text-xs truncate">{member.email}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {member.is_deleted
                          ? <Badge variant="red">탈퇴</Badge>
                          : <Badge variant="green">활성</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      {/* 최근 문의 */}
      <section className="space-y-2 md:w-1/2">
        <h2 className="text-sm font-semibold font-paperlogy text-muted-foreground flex items-center justify-between">
          최근 문의
          <Link href="/admin/contact" className="text-xs text-brand hover:underline underline-offset-4">
            전체 보기
          </Link>
        </h2>
        <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[40px] text-center">No</TableHead>
                <TableHead>내용</TableHead>
                <TableHead className="w-[80px] text-center">상태</TableHead>
                <TableHead className="w-[65px] text-center">답변</TableHead>
                <TableHead className="w-[130px] text-center hidden md:table-cell">문의일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    등록된 문의가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                recentContacts.map((contact, index) => (
                  <TableRow key={contact.id} className="hover:bg-gray-50 text-muted-foreground">
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="truncate max-w-0">
                      <div className="truncate">{contact.message}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      {contact.status === "pending" && <Badge variant="destructive">대기중</Badge>}
                      {contact.status === "progress" && <Badge variant="outline">처리중</Badge>}
                      {contact.status === "resolved" && <Badge variant="green">해결됨</Badge>}
                      {contact.status === "closed" && <Badge variant="outline">종료됨</Badge>}
                    </TableCell>
                    <TableCell className="text-center">
                      {contact.admin_reply
                        ? <Badge variant="destructive">완료</Badge>
                        : <Badge variant="outline">미답변</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">{formatDate(contact.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
