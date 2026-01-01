export default function EventNotice({ count }: { count: number }) {
  return (
    <div className="event__notice">
      <p className="text-sm text-gray-700 font-nanumNeo">
        현재 <span className="text-red-500 font-bold">{count}</span>개의
        이벤트가 있습니다.
      </p>
    </div>
  );
}
