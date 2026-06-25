# Guia simples: deixar os números atualizarem sozinhos

Este guia é para a parte que **depende de você** — pegar as "chaves de acesso"
das redes. Não precisa saber programar. Onde tiver dúvida, me chame.

> Lembrete: o automático funciona **só para as contas da campanha**. Perfis de
> adversários continuam atualizados na mão, direto no painel (regra das redes).

---

## Visão geral (3 passos)

1. **Pegar as chaves** de cada rede (abaixo).
2. **Publicar o conector** (o "servidorzinho" desta pasta) em um serviço gratuito.
3. **Colar o endereço do conector** no painel, em *Configurações → Fonte de dados → API*.

---

## Passo 1 — As chaves

### Instagram + Facebook (juntos, pela Meta)

A Meta cuida das duas redes com uma só conta de desenvolvedor.

1. A conta do **Instagram** da campanha precisa ser do tipo **Comercial/Criador**
   e estar **ligada a uma Página do Facebook** (isso se faz nas configurações do
   Instagram → "Conta profissional").
2. Acesse **developers.facebook.com** com o login que administra a Página,
   crie um app do tipo "Empresa".
3. Gere um **token de acesso de longa duração** com as permissões
   `pages_show_list`, `pages_read_engagement` e `instagram_basic`.
4. Anote:
   - o **token** → vai em `META_TOKEN`
   - o **ID da Página do Facebook** e o **ID da conta do Instagram** → vão em `META_MAP`

> Eu te passo o passo a passo detalhado de cliques quando chegarmos aqui — é a
> etapa mais chata, mas se faz uma vez só.

### TikTok

1. Acesse **developers.tiktok.com**, crie um app e ative o produto
   "Login Kit" + acesso ao escopo `user.info.stats`.
2. A conta da campanha faz **login uma vez** para autorizar o app.
3. Guarde o **token** gerado → vai em `TIKTOK_TOKEN`.

> O TikTok aprova esse acesso manualmente e pode levar alguns dias.

---

## Passo 2 — Publicar o conector

A pasta `backend/` já está pronta. Opção gratuita e simples: **Render** ou
**Railway** (ou rodar em qualquer servidor com Node 18+).

1. Suba esta pasta para o serviço escolhido.
2. No painel do serviço, preencha as variáveis do arquivo `.env.example`
   (token e IDs que você anotou no Passo 1).
3. O serviço te dá um endereço, algo como `https://conector-sidney.onrender.com`.

Para testar localmente antes:
```bash
cd backend
cp .env.example .env   # preencha o .env
npm start
# teste: http://localhost:3000/followers?network=facebook&handle=sidneycruzsp
```

---

## Passo 3 — Ligar no painel

1. Abra o painel → **Configurações**.
2. Em **Fonte de dados**, escolha **API**.
3. Cole o endereço do conector + `/followers`, ex.:
   `https://conector-sidney.onrender.com/followers`
4. Salve. Marque os perfis da campanha como **"atualizar sozinho"** ao
   cadastrá-los. Pronto — eles passam a buscar os números automaticamente.

---

## O que o conector responde

Para cada perfil, o painel chama:

```
GET <endereço>/followers?network=<rede>&handle=<usuario>
```

e recebe:

```json
{ "followers": 12345, "network": "instagram", "handle": "sidneycruz", "updatedAt": "..." }
```

Os tokens ficam **só no servidor** (nas variáveis de ambiente), nunca no
navegador — por isso é seguro.
