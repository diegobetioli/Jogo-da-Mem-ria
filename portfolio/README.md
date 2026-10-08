# Portfolio · Diego Betioli

Página única com os conteúdos web de Diego Betioli, organizados em categorias:

| Categoria | Pasta de arquivos |
| --- | --- |
| Artigos de blog SEO/GEO | `arquivos/blog-seo-geo/` |
| Artigos para LinkedIn | `arquivos/linkedin-artigos/` |
| Posts para C-Level | `arquivos/linkedin-c-level/` |
| Newsletters | `arquivos/newsletters/` |
| Redes sociais | `arquivos/redes-sociais/` |
| Roteiros de vídeo | `arquivos/roteiros-video/` |
| Livros e outros conteúdos | `arquivos/outros/` |

## Estrutura

```
portfolio/
├── index.html      # a página (layout, busca, modo edição)
├── conteudos.js    # perfil, categorias e lista de conteúdos
└── arquivos/       # PDFs, DOCX, imagens e vídeos, uma pasta por categoria
```

## Como adicionar conteúdos

### Opção 1: pelo próprio site (sem editar código)

1. Abra a página com `#editar` no final do endereço (ou clique em **Gerenciar conteúdos** no rodapé).
2. Clique em **Adicionar conteúdo**, escolha a categoria e informe um **link** ou envie um **arquivo**.
3. O que você cadastra fica salvo só no seu navegador. Para publicar, clique em **Exportar conteudos.js**:
   - baixe o novo `conteudos.js` e substitua o arquivo desta pasta;
   - baixe cada arquivo enviado e coloque-o no caminho indicado (ex.: `portfolio/arquivos/newsletters/edicao-01.pdf`);
   - faça commit e push.
4. Depois de publicar, clique em **Descartar alterações locais** para o navegador voltar a mostrar a versão publicada.

### Opção 2: editando o `conteudos.js`

Copie um bloco dentro de `"itens"` e ajuste os campos:

```js
{
  "id": "nl-edicao-01",                 // identificador único
  "categoria": "newsletters",           // id de uma das categorias
  "titulo": "Edição #1: GEO na prática",
  "veiculo": "Newsletter XCOM",         // opcional
  "cliente": "CEO da Empresa X",        // opcional (deixe de fora em projetos confidenciais)
  "data": "2025-03",                    // "AAAA", "AAAA-MM" ou "AAAA-MM-DD"
  "descricao": "Resumo do conteúdo.",
  "tags": ["GEO", "IA"],
  "url": "https://..."                  // para links
  // "arquivo": "arquivos/newsletters/edicao-01.pdf"   // para arquivos
}
```

Itens com `"revisar": true` mostram o selo **revisar link** no modo edição. Use esse campo para lembrar de trocar links provisórios.

## Publicação

O site é estático. Para publicar no GitHub Pages, ative o Pages no repositório (branch `main`, pasta raiz) e acesse `https://<usuario>.github.io/<repositorio>/portfolio/`.

A página já traz metadados de SEO e dados estruturados (`schema.org/Person`) para buscadores e mecanismos de IA.
