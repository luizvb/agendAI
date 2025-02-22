export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">AgendAI</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
