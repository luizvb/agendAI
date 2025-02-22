import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
  error?: Error;
  errorType?: "CORS" | "SERVER" | "GENERIC";
  onRetry?: () => void;
}

export function ErrorPage({
  error,
  errorType = "GENERIC",
  onRetry,
}: ErrorPageProps) {
  const getErrorMessage = () => {
    switch (errorType) {
      case "CORS":
        return "Erro de conexão com o servidor. Por favor, verifique sua conexão e tente novamente.";
      case "SERVER":
        return "O servidor está temporariamente indisponível. Por favor, tente novamente mais tarde.";
      default:
        return "Ocorreu um erro inesperado. Por favor, tente novamente.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h1>
        <p className="text-muted-foreground mb-4">{getErrorMessage()}</p>
        {error && (
          <p className="text-sm text-muted-foreground mb-4">
            Detalhes: {error.message}
          </p>
        )}
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
