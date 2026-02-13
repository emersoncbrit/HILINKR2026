# Criar tabela de Design do site (Painel Admin)

O erro **"Verifique se a tabela site_design_config existe"** aparece porque essa tabela ainda não foi criada no Supabase.

## Como corrigir

1. Acesse o **Supabase Dashboard** do seu projeto.
2. No menu lateral, clique em **SQL Editor**.
3. Clique em **New query**.
4. Copie todo o conteúdo do arquivo `migrations/20250213000000_site_design_config.sql` e cole no editor.
5. Clique em **Run** (ou Ctrl+Enter).
6. Deve aparecer "Success" em verde.
7. Volte ao site, abra **Painel Admin** → **Design do site** e clique em **Salvar design** de novo.

Depois disso, a configuração de logo e cores será salva normalmente.
