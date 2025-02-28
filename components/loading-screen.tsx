export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <img src="/logopretocut.png" alt="AgendAI Logo" className="h-20" />
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
