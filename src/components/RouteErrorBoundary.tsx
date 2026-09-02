import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[RouteErrorBoundary]", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="font-display text-xl font-bold text-primary">
            Não foi possível carregar esta página
          </h1>
          <p className="max-w-md text-[13px] text-muted-foreground">
            Ocorreu uma falha ao abrir o conteúdo. Tente novamente — se persistir, atualize a página.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => this.setState({ error: null })}>Tentar novamente</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recarregar
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
