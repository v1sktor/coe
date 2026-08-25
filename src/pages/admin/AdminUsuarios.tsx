import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, ShieldCheck, Plus, Settings, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles">;
type PermissaoRow = Tables<"permissoes">;
type CargoRow = Tables<"cargos">;

interface UserWithDetails {
  profile: ProfileRow;
  isAdmin: boolean;
  permissoes: string[]; // permissao ids
}

const AdminUsuarios = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [permissoes, setPermissoes] = useState<PermissaoRow[]>([]);
  const [cargos, setCargos] = useState<CargoRow[]>([]);
  const [newCargoId, setNewCargoId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newNome, setNewNome] = useState("");
  const [creating, setCreating] = useState(false);
  const [savingPerms, setSavingPerms] = useState(false);
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false);
  const [pwdUser, setPwdUser] = useState<UserWithDetails | null>(null);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const fetchData = async () => {
    const [
      { data: profiles },
      { data: roles },
      { data: permissoesData },
      { data: cargosData },
      { data: cargoPermsData },
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
      supabase.from("permissoes").select("*").order("nome"),
      supabase.from("cargos").select("*"),
      supabase.from("cargo_permissoes").select("*"),
    ]);

    if (permissoesData) setPermissoes(permissoesData);
    if (cargosData) setCargos(cargosData);

    if (profiles && roles) {
      // Build user perm map via cargo_id -> cargo_permissoes
      const userList: UserWithDetails[] = profiles.map((p: any) => {
        const userPerms: string[] = [];
        if (p.cargo_id && cargoPermsData) {
          cargoPermsData
            .filter((cp) => cp.cargo_id === p.cargo_id)
            .forEach((cp) => userPerms.push(cp.permissao_id));
        }
        return {
          profile: p,
          isAdmin: (roles || []).some((r) => r.user_id === p.user_id && r.role === "admin"),
          permissoes: userPerms,
        };
      });
      setUsers(userList);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const createUser = async () => {
    if (!newEmail || !newPassword || !newNome) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setCreating(true);
    const res = await supabase.functions.invoke("create-user", {
      body: { email: newEmail, password: newPassword, nome: newNome, cargo_id: newCargoId || null },
    });

    setCreating(false);
    if (res.error || res.data?.error) {
      toast({ title: "Erro ao criar usuário", description: res.data?.error || res.error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Usuário criado com sucesso" });
    setDialogOpen(false);
    setNewEmail("");
    setNewPassword("");
    setNewNome("");
    setNewCargoId("");
    fetchData();
  };

  const toggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (currentlyAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: currentlyAdmin ? "Admin removido" : "Admin concedido" });
    fetchData();
  };

  const setCargoUsuario = async (userId: string, cargoId: string) => {
    const { error } = await supabase.from("profiles").update({ cargo_id: cargoId }).eq("user_id", userId);
    if (error) { toast({ title: "Erro ao definir cargo", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Cargo atualizado" });
    fetchData();
  };

  const openPermDialog = (user: UserWithDetails) => {
    setSelectedUser(user);
    setSelectedPerms([...user.permissoes]);
    setPermDialogOpen(true);
  };

  const togglePerm = (permId: string) => {
    setSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const savePermissoes = async () => {
    if (!selectedUser) return;
    setSavingPerms(true);

    // We need a cargo for this user to store permissions via cargo_permissoes
    // Strategy: find or create a personal cargo for this user, then sync permissions
    let cargoId = selectedUser.profile.cargo_id;

    if (!cargoId) {
      // Create a personal cargo for the user
      const { data: newCargo, error: cargoErr } = await supabase
        .from("cargos")
        .insert({ nome: `Cargo - ${selectedUser.profile.nome}`, nivel_hierarquico: 999 })
        .select()
        .single();
      if (cargoErr || !newCargo) {
        toast({ title: "Erro ao criar cargo", description: cargoErr?.message, variant: "destructive" });
        setSavingPerms(false);
        return;
      }
      cargoId = newCargo.id;
      // Assign cargo to profile
      await supabase.from("profiles").update({ cargo_id: cargoId }).eq("user_id", selectedUser.profile.user_id);
    }

    // Remove all existing cargo_permissoes for this cargo
    await supabase.from("cargo_permissoes").delete().eq("cargo_id", cargoId);

    // Insert selected permissions
    if (selectedPerms.length > 0) {
      const rows = selectedPerms.map((permId) => ({ cargo_id: cargoId!, permissao_id: permId }));
      const { error } = await supabase.from("cargo_permissoes").insert(rows);
      if (error) {
        toast({ title: "Erro ao salvar permissões", description: error.message, variant: "destructive" });
        setSavingPerms(false);
        return;
      }
    }

    toast({ title: "Permissões atualizadas" });
    setSavingPerms(false);
    setPermDialogOpen(false);
    fetchData();
  };

  const getPermNomes = (permIds: string[]) => {
    return permIds.map((id) => permissoes.find((p) => p.id === id)?.nome).filter(Boolean);
  };

  const openPwdDialog = (user: UserWithDetails) => {
    setPwdUser(user);
    setNewPwd("");
    setConfirmPwd("");
    setPwdDialogOpen(true);
  };

  const updatePassword = async () => {
    if (!pwdUser) return;
    if (newPwd.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    if (newPwd !== confirmPwd) {
      toast({ title: "Senhas não conferem", variant: "destructive" });
      return;
    }
    setSavingPwd(true);
    const res = await supabase.functions.invoke("update-user-password", {
      body: { user_id: pwdUser.profile.user_id, password: newPwd },
    });
    setSavingPwd(false);
    if (res.error || res.data?.error) {
      toast({ title: "Erro ao alterar senha", description: res.data?.error || res.error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Senha alterada com sucesso" });
    setPwdDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1">Crie contas e atribua permissões</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-display uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" />
              Criar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide">Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome Completo</Label>
                <Input value={newNome} onChange={(e) => setNewNome(e.target.value)} placeholder="Nome do usuário" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="usuario@email.com" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="bg-secondary border-border" minLength={6} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cargo</Label>
                <Select value={newCargoId} onValueChange={setNewCargoId}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Selecione o cargo (define as permissões)" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">As permissões do usuário vêm do cargo selecionado.</p>
              </div>
              <Button onClick={createUser} disabled={creating} className="w-full font-display uppercase tracking-wider">
                {creating ? "Criando..." : "Criar Conta"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Usuários do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display uppercase text-xs">Nome</TableHead>
                <TableHead className="font-display uppercase text-xs">Cargo</TableHead>
                <TableHead className="font-display uppercase text-xs">Permissões</TableHead>
                <TableHead className="font-display uppercase text-xs">Role</TableHead>
                <TableHead className="font-display uppercase text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const permNomes = getPermNomes(u.permissoes);
                return (
                  <TableRow key={u.profile.id}>
                    <TableCell className="font-display font-semibold">{u.profile.nome}</TableCell>
                    <TableCell>
                      <Select
                        value={u.profile.cargo_id ?? ""}
                        onValueChange={(v) => setCargoUsuario(u.profile.user_id, v)}
                      >
                        <SelectTrigger className="h-8 w-48 bg-secondary border-border text-xs">
                          <SelectValue placeholder="Sem cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargos.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {permNomes.length > 0 ? (
                          permNomes.map((nome) => (
                            <Badge key={nome} variant="outline" className="text-xs border-primary/30 text-primary">
                              {nome}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem permissões</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isAdmin ? "default" : "outline"} className={u.isAdmin ? "bg-primary/20 text-primary border-primary/30" : ""}>
                        {u.isAdmin ? "Admin" : "Usuário"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openPermDialog(u)} className="font-display uppercase text-xs tracking-wider">
                          <Settings className="mr-1 h-3 w-3" />
                          Permissões
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openPwdDialog(u)} className="font-display uppercase text-xs tracking-wider">
                          <KeyRound className="mr-1 h-3 w-3" />
                          Alterar senha
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleAdmin(u.profile.user_id, u.isAdmin)} className="font-display uppercase text-xs tracking-wider">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          {u.isAdmin ? "Remover Admin" : "Tornar Admin"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum usuário cadastrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Permissões */}
      <Dialog open={permDialogOpen} onOpenChange={setPermDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              Permissões — {selectedUser?.profile.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {permissoes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma permissão cadastrada. Crie permissões primeiro na aba de Cargos.</p>
            )}
            {permissoes.map((perm) => (
              <label key={perm.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 cursor-pointer">
                <Checkbox
                  checked={selectedPerms.includes(perm.id)}
                  onCheckedChange={() => togglePerm(perm.id)}
                />
                <div>
                  <span className="font-display text-sm font-medium">{perm.nome}</span>
                  {perm.descricao && (
                    <p className="text-xs text-muted-foreground">{perm.descricao}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
          <Button onClick={savePermissoes} disabled={savingPerms} className="w-full font-display uppercase tracking-wider mt-2">
            {savingPerms ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog de Alterar Senha */}
      <Dialog open={pwdDialogOpen} onOpenChange={setPwdDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              Alterar senha — {pwdUser?.profile.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nova senha</Label>
              <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Mínimo 6 caracteres" className="bg-secondary border-border" minLength={6} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirmar nova senha</Label>
              <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Digite novamente" className="bg-secondary border-border" minLength={6} />
            </div>
            <Button onClick={updatePassword} disabled={savingPwd} className="w-full font-display uppercase tracking-wider">
              {savingPwd ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsuarios;
