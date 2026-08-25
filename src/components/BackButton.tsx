import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  variant?: "light" | "default";
  label?: string;
}

export function BackButton({ className, variant = "default", label = "Voltar" }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleBack}
      className={cn(
        "gap-1",
        variant === "light" &&
          "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
