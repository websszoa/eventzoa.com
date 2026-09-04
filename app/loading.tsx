export default function LoadingPage() {
  return (
    <div
      role="status"
      aria-label="페이지를 불러오는 중"
      className="flex min-h-screen flex-col items-center justify-center"
    >
      <div className="loading" aria-hidden="true" />
    </div>
  );
}
