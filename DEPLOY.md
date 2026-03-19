# AxionTax — Guia de Deploy

## Visão Geral

Este projeto é a landing page do AxionTax com captura de leads via Supabase.
Stack: Vite + React + Supabase. Deploy na Vercel.

---

## 1. Configurar o Supabase (5 min)

1. Acesse **https://supabase.com** e crie uma conta (ou faça login)
2. Clique em **New Project** e crie o projeto "axiontax"
3. Após criação, vá em **SQL Editor** e execute este comando:

```sql
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'register',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para evitar duplicatas por email
CREATE UNIQUE INDEX leads_email_unique ON leads (email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: permitir INSERT do frontend (anon key)
CREATE POLICY "Allow anonymous inserts" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Política: bloquear SELECT do frontend (só via dashboard)
CREATE POLICY "Block anonymous reads" ON leads
  FOR SELECT
  USING (false);
```

4. Vá em **Settings > API** e copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public key** (começa com `eyJ...`)

---

## 2. Subir o Projeto no GitHub

```bash
cd axiontax-deploy
git init
git add .
git commit -m "feat: landing page + supabase lead capture"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/axiontax-landing.git
git push -u origin main
```

---

## 3. Deploy na Vercel (5 min)

1. Acesse **https://vercel.com** e faça login
2. Clique em **Add New > Project**
3. Importe o repositório `axiontax-landing` do GitHub
4. Na tela de configuração:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = sua Project URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua anon key do Supabase
6. Clique em **Deploy**

---

## 4. Conectar Domínio Próprio

1. No dashboard da Vercel, vá em **Settings > Domains**
2. Adicione seu domínio (ex: `axiontax.com.br`)
3. A Vercel vai mostrar os registros DNS necessários:
   - Geralmente um **CNAME** apontando para `cname.vercel-dns.com`
   - Ou um **A record** para o IP da Vercel
4. Vá no painel do seu registrador de domínio e configure os DNS
5. Aguarde propagação (geralmente 5-30 min)
6. A Vercel configura SSL automaticamente

---

## 5. Verificar Leads

Para ver os leads capturados:

1. Acesse o **Supabase Dashboard**
2. Vá em **Table Editor > leads**
3. Todos os cadastros e tentativas de login aparecerão aqui

Para exportar em CSV: clique no botão **Export** no canto superior direito da tabela.

---

## Estrutura do Projeto

```
axiontax-deploy/
├── index.html            # Entry point
├── package.json          # Dependências
├── vite.config.js        # Configuração Vite
├── vercel.json           # Rewrite rules para SPA
├── .env.example          # Template de variáveis
├── public/
│   └── favicon.svg       # Favicon
└── src/
    ├── main.jsx          # React entry
    ├── App.jsx           # Landing page completa
    └── supabase.js       # Cliente Supabase
```

---

## Notas

- **Sem Supabase**: se as env vars não forem configuradas, a página funciona normalmente — só não salva leads no banco. Ideal para testar localmente.
- **RLS**: a tabela `leads` está protegida. O frontend só pode inserir, não ler. Os dados só são acessíveis via dashboard do Supabase.
- **Dev local**: `npm install && npm run dev` — roda em http://localhost:5173
