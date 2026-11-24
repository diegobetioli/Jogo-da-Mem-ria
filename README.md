# Jogo-da-Mem-ria
Teste de jogo da memória criado pelo Gemini

## ATS Duel Card

Jogo de cartas em estilo 16 bits: você (só aparecem as suas mãos) enfrenta um robô recrutador em um duelo no estilo Super Trunfo.

**Jogar:** https://diegobetioli.github.io/Jogo-da-Mem-ria/ats-duel-card/

- Cada lado recebe 5 cartas, distribuídas aleatoriamente a cada partida.
- Suas cartas ficam viradas para baixo: você escolhe uma às cegas e só descobre qual é ao jogá-la. O robô responde com uma das dele, e vence o duelo quem tiver mais estrelas.
- Ganha a partida quem vencer 3 duelos primeiro. Em empate de estrelas, ninguém pontua. Se o placar terminar empatado, há uma prorrogação com cartas às cegas.
- As cartas do robô são mais fortes de propósito.

Controles: `←` `→` (ou `1` a `5`) para escolher, `ENTER` para jogar ou continuar e `M` para ligar ou desligar o som. No celular ou com o mouse, basta tocar ou clicar (no toque, o primeiro toque destaca a carta e o segundo a joga).

O jogo é responsivo: na horizontal usa a mesa larga e, com o celular na vertical, troca automaticamente para um layout em pé, com as cartas do duelo empilhadas (robô em cima, você embaixo). Dá para girar o aparelho no meio da partida.

O jogo inteiro está em [`ats-duel-card/index.html`](ats-duel-card/index.html), em HTML, CSS e JavaScript puros e sem dependências (a fonte Press Start 2P vem do Google Fonts).

Diego Betioli. 2026. Todos os direitos reservados.
