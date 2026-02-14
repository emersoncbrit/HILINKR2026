import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";
import { useState, useEffect } from "react";

const USERNAME_DAYS = 15;

export function UsernameRequiredDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-username", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("username, username_changed_at")
        .eq("user_id", user.id)
        .maybeSingle();
      return data as { username: string | null; username_changed_at: string | null } | null;
    },
    enabled: !!user?.id,
  });

  const username = profile?.username?.trim() || null;
  const open = !!user && !isLoading && !username;

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  const normalized = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");

  const handleSave = async () => {
    if (!user || !normalized) {
      toast({ title: "Digite um username válido", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: normalized,
        username_changed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      if (error.message.includes("unique") || error.message.includes("duplicate")) {
        toast({ title: "Username já está em uso", variant: "destructive" });
      } else {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Username definido!" });
      void queryClient.invalidateQueries({ queryKey: ["profile-username", user.id] });
    }
    setSaving(false);
  };

  if (!open) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Definir seu username
          </DialogTitle>
          <DialogDescription>
            Para usar seu link na bio (hilinkr.com/seu_usuario), lojas e campanhas, defina um username. Você poderá alterá-lo apenas uma vez a cada {USERNAME_DAYS} dias.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="username-popup">Username</Label>
            <Input
              id="username-popup"
              value={value}
              onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              placeholder="seu_username"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <p className="text-xs text-muted-foreground mt-1">Apenas letras, números, _ e -</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => void handleSave()} disabled={saving || !normalized}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
