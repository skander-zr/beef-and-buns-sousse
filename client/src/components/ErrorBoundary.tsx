import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={64}
              className="text-destructive mb-6 flex-shrink-0"
              color="red"
            />

            <h2 className="text-2xl mb-4 font-bold text-red-600">Oups, une erreur technique est survenue !</h2>
            <p className="mb-4 text-black font-medium">Veuillez prendre une capture d'écran de cette page et l'envoyer au développeur :</p>

            <div className="p-4 w-full rounded bg-white border-2 border-red-200 overflow-auto mb-6 text-left">
              <pre className="text-xs text-black whitespace-break-spaces font-mono">
                {this.state.error?.stack || this.state.error?.message || "Erreur inconnue"}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
