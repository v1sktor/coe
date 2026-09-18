import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowLeft, Scale, Gavel } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-4bpchq.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const error = await login(email, password);
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Erro de autenticação", description: error, variant: "destructive" });
    }
    // Navigation handled by useEffect above
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <img
            src={logo}
            alt="Emblema do 4º BPChq COE/GATE"
            width={1024}
            height={1024}
            className="mx-auto h-24 w-24 object-contain"
          />
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest">
              Acesso Administrativo
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Acesso restrito a pessoal autorizado
            </p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-display">
              <Lock className="h-3 w-3" />
              Autenticação
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@pmesp.gov.br" className="pl-10 bg-secondary border-border" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 bg-secondary border-border" required />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting || loading} className="w-full font-display uppercase tracking-widest">
                {isSubmitting || loading ? "Processando..." : "Acessar sistema"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            asChild
            className="w-full font-display uppercase tracking-widest"
          >
            <Link to="/juridico">
              <Scale className="mr-2 h-4 w-4" />
              Jurídico
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full font-display uppercase tracking-widest"
          >
            <Link to="/corregedoria">
              <Gavel className="mr-2 h-4 w-4" />
              SJD
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <Button variant="ghost" asChild className="text-muted-foreground text-sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao site
            </Link>
          </Button>
        </div>


        <p className="text-center text-xs text-muted-foreground">
          Sistema de uso exclusivo. Acesso não autorizado é crime.
        </p>
      </div>
    </div>
  );
};

export default Login;
