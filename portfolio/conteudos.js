/*
 * Conteúdos do portfolio de Diego Betioli.
 *
 * Como adicionar um conteúdo manualmente:
 *   1. Copie um bloco de "itens" e altere os campos.
 *   2. Para links, preencha "url". Para arquivos, coloque o arquivo em
 *      arquivos/<categoria>/ e preencha "arquivo" com o caminho relativo
 *      (ex.: "arquivos/newsletters/edicao-01.pdf").
 *   3. "categoria" deve ser um dos ids listados em "categorias".
 *   4. "data" aceita "AAAA", "AAAA-MM" ou "AAAA-MM-DD".
 *
 * Também é possível adicionar pelo próprio site: abra a página com #editar
 * no fim do endereço, cadastre os conteúdos e use "Exportar conteudos.js"
 * para gerar uma nova versão deste arquivo.
 */
window.PORTFOLIO = {
  "perfil": {
    "nome": "Diego Betioli",
    "cargo": "Redator SEO & GEO, estrategista de conteúdo digital e escritor",
    "destaque": "SEO & GEO",
    "bio": "Publicitário em São Paulo, com MBA em Marketing, Branding & Growth pela PUC-RS. Lidera projetos de marketing digital e comunicação integrada, escreve para buscadores e para IAs generativas e assina livros de terror e mistério. Cofundador e editor do portal geek Meta Galáxia.",
    "local": "São Paulo, Brasil",
    "links": [
      { "rotulo": "LinkedIn", "url": "https://www.linkedin.com/in/diegobetioli/" },
      { "rotulo": "Instagram", "url": "https://www.instagram.com/diegobetioli/" },
      { "rotulo": "Bluesky", "url": "https://bsky.app/profile/diegobetioli.bsky.social" },
      { "rotulo": "Linktree", "url": "https://linktr.ee/diegosbetioli" }
    ]
  },

  "categorias": [
    { "id": "blog-seo-geo", "nome": "Artigos de blog SEO/GEO", "descricao": "Textos otimizados para buscadores e para mecanismos de resposta com IA, como ChatGPT, Gemini e Perplexity." },
    { "id": "linkedin-artigos", "nome": "Artigos para LinkedIn", "descricao": "Artigos autorais publicados no LinkedIn sobre comunicação, cultura, esporte e comportamento." },
    { "id": "linkedin-c-level", "nome": "Posts para C-Level", "descricao": "Posts de LinkedIn escritos para executivos. Projetos de ghostwriting podem aparecer sem o nome do cliente." },
    { "id": "newsletters", "nome": "Newsletters", "descricao": "Edições de newsletters corporativas e editoriais." },
    { "id": "redes-sociais", "nome": "Redes sociais", "descricao": "Perfis, posts, carrosséis e campanhas para redes sociais." },
    { "id": "roteiros-video", "nome": "Roteiros de vídeo", "descricao": "Roteiros para vídeos institucionais, YouTube, Reels e TikTok." },
    { "id": "outros", "nome": "Livros e outros conteúdos", "descricao": "Livros publicados, antologias e outros projetos editoriais." }
  ],

  "itens": [
    {
      "id": "mg-tabula-rasa",
      "categoria": "blog-seo-geo",
      "titulo": "Tabula Rasa: resenha da série original Netflix",
      "veiculo": "Meta Galáxia",
      "data": "2018",
      "descricao": "Resenha da série belga de suspense psicológico, escrita para o portal de cultura pop Meta Galáxia.",
      "tags": ["resenha", "séries", "cultura pop"],
      "url": "https://metagalaxia.com.br/series/tabula-rasa-netflix-resenha/"
    },
    {
      "id": "mg-comix-zone-2022",
      "categoria": "blog-seo-geo",
      "titulo": "Lançamentos Comix Zone 2022: primeiro semestre",
      "veiculo": "Meta Galáxia",
      "data": "2022",
      "descricao": "Guia dos quadrinhos lançados pela editora Comix Zone no primeiro semestre de 2022.",
      "tags": ["HQ", "guia", "lançamentos"],
      "url": "https://metagalaxia.com.br/hq/lancamentos-comix-zone-2022-primeiro-semestre/"
    },
    {
      "id": "li-ted-lasso",
      "categoria": "linkedin-artigos",
      "titulo": "Ted Lasso e a fortaleza de vidro",
      "veiculo": "LinkedIn",
      "data": "2022-01-16",
      "descricao": "A série Ted Lasso como ponto de partida para falar de saúde mental e da fragilidade de quem precisa parecer forte o tempo todo.",
      "tags": ["saúde mental", "liderança", "séries"],
      "url": "https://pt.linkedin.com/pulse/ted-lasso-e-fortaleza-de-vidro-diego-betioli"
    },
    {
      "id": "li-lampions-2022",
      "categoria": "linkedin-artigos",
      "titulo": "05 motivos para não perder a Lampions 2022",
      "veiculo": "LinkedIn",
      "data": "2022",
      "descricao": "Por que acompanhar a Copa do Nordeste de 2022.",
      "tags": ["futebol", "esporte"],
      "url": "https://www.linkedin.com/in/diegobetioli/recent-activity/articles/",
      "revisar": true
    },
    {
      "id": "li-hulk-galo",
      "categoria": "linkedin-artigos",
      "titulo": "O Incrível Hulk: liderando os Galos Vingadores",
      "veiculo": "LinkedIn",
      "descricao": "Futebol e cultura pop: o papel de Hulk na equipe do Atlético Mineiro.",
      "tags": ["futebol", "liderança"],
      "url": "https://www.linkedin.com/in/diegobetioli/recent-activity/articles/",
      "revisar": true
    },
    {
      "id": "li-cometa-haller",
      "categoria": "linkedin-artigos",
      "titulo": "O Cometa Haller: o lugar certo, a hora certa",
      "veiculo": "LinkedIn",
      "descricao": "A trajetória de Sébastien Haller no futebol europeu.",
      "tags": ["futebol", "carreira"],
      "url": "https://www.linkedin.com/in/diegobetioli/recent-activity/articles/",
      "revisar": true
    },
    {
      "id": "rs-instagram",
      "categoria": "redes-sociais",
      "titulo": "Instagram @diegobetioli",
      "veiculo": "Instagram",
      "descricao": "Perfil de escritor de terror e mistério, finalista do I Prêmio ABERST Inéditos.",
      "tags": ["perfil", "literatura"],
      "url": "https://www.instagram.com/diegobetioli/"
    },
    {
      "id": "rs-bluesky",
      "categoria": "redes-sociais",
      "titulo": "Bluesky @diegobetioli.bsky.social",
      "veiculo": "Bluesky",
      "descricao": "Esporte, entretenimento e bastidores dos livros.",
      "tags": ["perfil"],
      "url": "https://bsky.app/profile/diegobetioli.bsky.social"
    },
    {
      "id": "rs-linktree",
      "categoria": "redes-sociais",
      "titulo": "Linktree",
      "veiculo": "Linktree",
      "descricao": "Todos os links em um só lugar.",
      "tags": ["perfil"],
      "url": "https://linktr.ee/diegosbetioli"
    },
    {
      "id": "ou-ultima-estacao",
      "categoria": "outros",
      "titulo": "A Última Estação",
      "veiculo": "Livro · com Rodolfo Bezerra",
      "data": "2018",
      "descricao": "Suspense e terror: um grupo de pessoas é levado pelo metrô a um lugar desconhecido e surreal. A continuação, A Última Estação II, saiu em 2024.",
      "tags": ["livro", "terror", "suspense"],
      "url": "https://www.amazon.com.br/%C3%BAltima-esta%C3%A7%C3%A3o-Diego-Betioli-ebook/dp/B087C5PDC9"
    },
    {
      "id": "ou-cep",
      "categoria": "outros",
      "titulo": "CEP",
      "veiculo": "Livro · Editora Viseu",
      "data": "2021",
      "descricao": "A história de Jefferson, jovem carteiro que trabalha na Zona Leste de São Paulo.",
      "tags": ["livro", "mistério"],
      "url": "https://www.amazon.com.br/CEP-Diego-Betioli/dp/6559851001"
    },
    {
      "id": "ou-bom-menino",
      "categoria": "outros",
      "titulo": "Bom Menino",
      "veiculo": "eBook Kindle",
      "descricao": "Narrativa curta de terror publicada em formato digital.",
      "tags": ["eBook", "terror"],
      "url": "https://www.amazon.com.br/Bom-Menino-Diego-Betioli-ebook/dp/B0G47SPMHX"
    },
    {
      "id": "ou-skoob",
      "categoria": "outros",
      "titulo": "Bibliografia completa no Skoob",
      "veiculo": "Skoob",
      "descricao": "Inclui Em Casas, O Que Sabem Essas Paredes e as antologias com contos do autor.",
      "tags": ["bibliografia", "antologias"],
      "url": "https://www.skoob.com.br/livro/lista/Diego+Betioli/tipo:autor/"
    },
    {
      "id": "ou-meta-galaxia",
      "categoria": "outros",
      "titulo": "Meta Galáxia",
      "veiculo": "Portal geek · cofundador e editor",
      "descricao": "Portal de resenhas e notícias sobre quadrinhos, filmes, séries, games, animes e mangás. Responsável pela estratégia e pelo calendário editorial.",
      "tags": ["editoria", "cultura pop"],
      "url": "https://metagalaxia.com.br/"
    }
  ]
};
