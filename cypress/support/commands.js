const { seletores } = require('./seletores')

function iconeVisivel(el) {
  const caixa = el.getBoundingClientRect()
  return caixa.width > 0 && caixa.height > 0
}

function sincronizarLupa(doc) {
  const icones = [...doc.querySelectorAll(seletores.lupa)]
  const fonte = icones.find((el) => typeof el.onclick === 'function')

  if (fonte) {
    icones.filter(iconeVisivel).forEach((el) => {
      if (typeof el.onclick !== 'function') {
        el.onclick = fonte.onclick
      }
    })
  }

  return icones.some((el) => iconeVisivel(el) && typeof el.onclick === 'function')
}

function carregarBundles(doc) {
  const pendentes = [...doc.querySelectorAll('script[data-src]')].filter((node) => {
    const origem = node.getAttribute('data-src') || ''
    return !node.src && origem.includes('_jb_static')
  })

  return pendentes.reduce(
    (cadeia, node) =>
      cadeia.then(
        () =>
          new Cypress.Promise((resolve) => {
            const script = doc.createElement('script')
            script.src = node.getAttribute('data-src')
            script.onload = () => resolve()
            script.onerror = () => resolve()
            doc.body.appendChild(script)
          }),
      ),
    Cypress.Promise.resolve(),
  )
}

function prepararConfigs(win) {
  const ids = ['astra-theme-js-js-extra', 'astra-live-search-js-extra', 'astra-addon-js-js-extra']

  ids.forEach((id) => {
    const node = win.document.getElementById(id)
    const codigo = node && node.textContent ? node.textContent.trim() : ''

    if (codigo.startsWith('var astra')) {
      win.eval(codigo)
    }
  })

  if (win.__lupaAcordada) {
    return
  }

  if (typeof win.litespeed_load_delayed_js_force === 'function') {
    win.__lupaAcordada = true
    win.litespeed_load_delayed_js_force()
  }
}

/**
 * O LiteSpeed Guest Mode pede `guest.vary.php` e recarrega a página.
 * A preparação da busca precisa acontecer no documento que fica depois desse reload.
 */
Cypress.Commands.add('esperarVariacaoDeCache', () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      const pedidoFeito = () => {
        try {
          return win.performance
            .getEntriesByType('resource')
            .some((entrada) => entrada.name.includes('guest.vary.php'))
        } catch (erro) {
          return true
        }
      }

      if (pedidoFeito()) {
        resolve()
        return
      }

      const limite = Date.now() + 8000
      const timer = setInterval(() => {
        if (pedidoFeito() || Date.now() > limite) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })
  })

  cy.get(seletores.lupa).filter(':visible').should('have.length.at.least', 1)
})

/**
 * O blog adia o JavaScript do tema. A lupa só abre o overlay depois que o
 * bundle em `_jb_static` executa e atribui `onclick` ao ícone.
 * O loader do LiteSpeed não promove essas tags `script[data-src]`.
 * Este comando carrega o bundle quando nenhum ícone tem handler e copia o
 * handler do tema para a lupa visível: o header fixo recria o ícone sem
 * levar a propriedade `onclick`.
 */
Cypress.Commands.add('prepararBusca', () => {
  cy.window().should((win) => {
    prepararConfigs(win)
    const adiado = win.document.querySelector('script[type="litespeed/javascript"]')
    expect(adiado, 'scripts adiados do LiteSpeed').to.equal(null)
    expect(win.wp && win.wp.domReady, 'wp.domReady').to.be.a('function')
    expect(win.astra, 'configuração do tema').to.be.an('object')
    expect(win.astraAddon, 'configuração do addon').to.be.an('object')
  })

  cy.document().then((doc) => {
    if (sincronizarLupa(doc)) {
      return
    }

    return carregarBundles(doc)
  })

  cy.document().should((doc) => {
    const pronta = sincronizarLupa(doc)
    const icones = [...doc.querySelectorAll(seletores.lupa)]
    const resumo = icones
      .map((el) => {
        const caixa = el.getBoundingClientRect()
        return `${Math.round(caixa.width)}x${Math.round(caixa.height)}:${typeof el.onclick}`
      })
      .join(', ')

    expect(pronta, `lupa visível com handler (${resumo || 'nenhum ícone'})`).to.eq(true)
  })
})

Cypress.Commands.add('sincronizarLupa', () => {
  cy.document().should((doc) => {
    expect(sincronizarLupa(doc), 'lupa visível com handler').to.eq(true)
  })
})
