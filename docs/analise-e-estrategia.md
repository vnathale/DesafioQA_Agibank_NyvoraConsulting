# Análise e estratégia de teste

Modelo para decidir o que automatizar antes de escrever a suíte. Este arquivo usa a pesquisa de artigos do [blog do Agi](https://blog.agibank.com.br/) como exemplo preenchido. Em outro produto, troque o contexto e mantenha a mesma sequência.

## 1. Objetivo

Proteger a jornada em que uma pessoa abre a pesquisa pela lupa, informa um termo e entende o que o blog devolveu: uma lista de artigos ou um aviso de que nada foi encontrado.

Fora deste objetivo: cadastro, comentários, menu, web stories e o conteúdo editorial de cada artigo.

## 2. Como a pesquisa funciona

| Passo | O que o blog faz |
| --- | --- |
| Entrada | Ícone no canto superior direito (`a.astra-search-icon`, rótulo "Search icon link") |
| Formulário | Overlay em tela cheia. Campo `input[name="s"]`, placeholder "Digite sua busca". Botão `#search_submit` com rótulo "Pesquisar" |
| Envio | `GET` para a home com o parâmetro `s` |
| Com resultado | Título "Resultados encontrados para: {termo}" e uma lista de `article` |
| Sem resultado | O mesmo título, nenhum `article`, e o texto "Lamentamos, mas nada foi encontrado para sua pesquisa, tente novamente com outras palavras." |

O endereço citado no enunciado, `https://blogdoagi.com.br/`, abre `https://blog.agibank.com.br/`. A suíte usa o host final para não depender do redirecionamento.

O header de desktop aparece a partir de 922 px (`astra.break_point` = 921). A suíte fixa o viewport em 1366×768, que é o layout da lupa descrita no enunciado. Abaixo disso o tema troca para outro header.

## 3. Riscos que justificam automação

1. **A lupa deixa de abrir o campo.** A entrada da jornada some e a pesquisa deixa de existir para quem usa o header.
2. **Um termo conhecido deixa de listar artigos.** Regressão de consulta, de template ou de navegação até `/?s=`.
3. **Um termo inexistente passa a mostrar conteúdo ou perde a mensagem.** A pessoa não distingue "não achei" de "achei outra coisa".
4. **O termo pesquisado some da página de resultado.** A URL ou o título deixam de confirmar o que foi pedido.

Riscos observados e deixados de fora da suíte, com o motivo:

| Observação | Decisão |
| --- | --- |
| `/?s=` vazio lista os posts recentes e o título fica "Resultados encontrados para:" | Comportamento ambíguo. Vira critério só depois de uma decisão de produto |
| O bundle de sugestões escuta `window.load` e o JavaScript do tema só entra depois da primeira interação | A sugestão ao digitar não entra na suíte até o carregamento do script acontecer antes do `load` |
| `#close` do overlay fica coberto pelo header fixo; o clique não chega no botão | Fechar pelo botão não é um caminho estável. A suíte dispensa a busca com Escape, que o tema trata em `document.onkeydown` |
| Paginação, mobile e o conteúdo interno do artigo | Outra jornada, outro risco |

## 4. Cenários automatizados

Três cenários, os dois primeiros são o núcleo. O terceiro trava a entrada e a saída da lupa, que é o objeto do enunciado.

1. **Termo existente.** Pesquisar `cartão` pela lupa. A URL fica `?s=cartão`, o título repete o termo e pelo menos um artigo menciona o termo, sem depender de um post específico.
2. **Termo inexistente.** Pesquisar `zzzxqy987termoinexistente`. A URL e o título repetem o termo, a lista de artigos fica vazia e a mensagem de ausência aparece.
3. **Abrir e sair.** A lupa mostra o campo "Digite sua busca" e Escape devolve a home sem `?s=` e sem hash.

Os termos ficam em `cypress/fixtures/busca.json`. Trocar o termo de um projeto novo é troca de dado, não de fluxo.

## 5. Desenho da suíte

```
cenário (e2e)
  -> page object   (o que a pessoa faz e o que ela deve perceber)
    -> seletores   (o contrato com o HTML, num arquivo só)
      -> comando   (preparação do JavaScript adiado, isolada do cenário)
```

- **E2E no site publicado.** O valor está na jornada real. A suíte não mocka a busca.
- **Page objects finos.** O spec não contém seletor CSS. `pagina-inicial` pesquisa; `pagina-resultados` confere o retorno.
- **Oráculo resiliente.** A comparação do termo ignora acento e caixa. O teste aceita qualquer artigo que mencione o termo, porque o ranking editorial muda.
- **Espera explícita.** O Cypress repete a asserção até o timeout. Não há `cy.wait` com tempo fixo.
- **Uma tentativa extra no `cypress run`.** O alvo é um site de produção, sujeito a latência. No modo interativo não há retry, para a falha aparecer na hora.
- **Electron como navegador padrão.** Ele vem com o Cypress, então `npm test` roda em Windows, macOS e Linux sem instalar Chrome. O Chrome continua disponível com `npm run test:chrome`.

## 6. Achado de testabilidade

O HTML entrega o JavaScript da busca em tags `<script type="text/javascript" data-src=".../_jb_static/...">`. Sem `src`, o navegador não executa o arquivo. O loader do LiteSpeed (`litespeed_load_delayed_js_force`) só promove scripts `type="litespeed/javascript"`.

Efeito observado: o clique na lupa altera o hash para `#` e o overlay `#ast-seach-full-screen-form` permanece com `display: none`. Depois que o bundle `_jb_static` executa, o ícone recebe `onclick`, o overlay abre e o formulário navega para `/?s=`.

O Guest Mode do LiteSpeed ainda pede `guest.vary.php` e recarrega a home uma vez. `cy.esperarVariacaoDeCache()` segura a suíte até esse pedido existir e a lupa do documento seguinte estar visível.

`cy.prepararBusca()` cobre esse vão:

1. Dispara o loader do LiteSpeed e lê as configs `astra` / `astraAddon` que ainda estiverem no HTML.
2. Espera os scripts `type="litespeed/javascript"` saírem da página e `wp.domReady` existir. O bundle da busca quebra se rodar antes disso.
3. Se nenhuma lupa tiver `onclick`, carrega em ordem os bundles `_jb_static` que ainda estão em `data-src`.
4. Copia esse handler para a lupa visível. O header fixo recria o ícone e a cópia nasce sem a propriedade `onclick`.

Quando o blog passar a entregar esse script sozinho, o comando não injeta nada. O cenário continua o mesmo.

Erros de terceiros que não impedem a pesquisa (`imagesLoaded is not a function` no carrossel, `ResizeObserver`, `Script error`) são ignorados em `cypress/support/e2e.js`. Qualquer outra exceção continua falhando o teste.

## 7. Como reutilizar em outro projeto

1. Preencher as seções 1 a 4 com o produto novo antes de abrir o Cypress.
2. Manter no spec só a linguagem da pessoa usuária.
3. Colocar cada seletor em `cypress/support/seletores.js`.
4. Colocar massa em `cypress/fixtures`.
5. Isolar contorno de ambiente em um command, com o motivo escrito no próprio arquivo.
6. Fazer `npm test` ser o mesmo comando do pipeline.
7. Registrar no README o que a suíte deixa de fora e por quê.
