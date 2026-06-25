# Painel de Redes Sociais · Sidney Cruz

Dashboard para acompanhar, **em tempo real**, o crescimento de seguidores dos
perfis políticos cadastrados nas redes **Instagram**, **Facebook** e **TikTok**.

Para cada rede e cada perfil, o painel exibe:

- **Seguidores atuais**
- **Crescimento nos últimos 30 dias** (absoluto e percentual)
- Mini-gráfico (sparkline) com a evolução recente
- Totais consolidados por rede

## Como usar

Abra o `index.html` no navegador (ou publique via GitHub Pages). Os dados ficam
salvos no `localStorage` do próprio navegador.

1. **Adicionar perfil** — informe rede, nome, @usuário e seguidores atuais.
   Opcionalmente informe os seguidores de 30 dias atrás para o crescimento
   aparecer imediatamente.
2. **Atualizar números** — clique no ✎ de um card (modo manual) ou configure
   uma fonte automática em **Configurações**.
3. **Exportar / Importar** — backup dos dados em JSON (rodapé).

## Fontes de dados

Em **Configurações → Fonte de dados**:

- **Manual** — você registra os números (cada atualização vira um ponto no
  histórico, alimentando o cálculo de 30 dias).
- **Simulação** — gera variação realista, útil para demonstração.
- **API** — busca de um endpoint próprio:
  `GET endpoint?network=<rede>&handle=<usuario>` → `{ "followers": 12345 }`.

> ⚠️ As APIs oficiais (Instagram/Facebook **Graph API** e **TikTok**) exigem
> tokens de acesso e contas business, e **não podem ser chamadas direto do
> navegador** (CORS + segredo do token). O caminho recomendado é um pequeno
> backend/proxy que guarde os tokens e exponha o endpoint acima. O painel já
> está pronto para consumir esse endpoint.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `index.html` | Dashboard (página principal) |
| `assets/styles.css` | Estilos |
| `assets/app.js` | Lógica, persistência e cálculo de métricas |
| `jogo-da-memoria.html` | Jogo da memória original (preservado) |
