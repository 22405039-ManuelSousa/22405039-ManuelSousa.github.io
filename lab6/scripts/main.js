document.addEventListener("DOMContentLoaded", function () {
  carregarProdutos(produtos)
  atualizaCesto()
})

function carregarProdutos(lista) {
  const secaoProdutos = document.querySelector("#lista-produtos")
  lista.forEach(function (produto) {
    const artigo = criarProduto(produto)
    secaoProdutos.append(artigo)
  })
}

function criarProduto(produto) {

  const article = document.createElement("article")
  const titulo = document.createElement("h2")
  titulo.textContent = produto.title
  const imagem = document.createElement("img")
  imagem.src = produto.image
  imagem.alt = produto.title
  const descricao = document.createElement("p")
  descricao.textContent = produto.description
  const preco = document.createElement("p")
  preco.textContent = produto.price + " €"
  const botao = document.createElement("button")
  botao.textContent = "+ Adicionar ao Cesto"

  botao.addEventListener("click", function () {
    let produtosCesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || []
    produtosCesto.push(produto)
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosCesto))
    atualizaCesto()
  })

  article.append(titulo, imagem, descricao, preco, botao)
  return article
}

function atualizaCesto() {
  const secaoCesto = document.querySelector("#lista-cesto")
  secaoCesto.innerHTML = ""
  let produtosCesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || []
  produtosCesto.forEach(function (produto) {
    const artigo = criarProdutoCesto(produto)
    secaoCesto.append(artigo)
  })
  atualizarTotal();
}

function criarProdutoCesto(produto) {
  const article = document.createElement("article")
  const titulo = document.createElement("h2")
  titulo.textContent = produto.title
  const imagem = document.createElement("img")
  imagem.src = produto.image
  imagem.alt = produto.title
  const descricao = document.createElement("p")
  descricao.textContent = produto.description
  const preco = document.createElement("p")
  preco.textContent = produto.price + " €"
  const botaoRemover = document.createElement("button")
  botaoRemover.textContent = "- Remover do Cesto"

  botaoRemover.addEventListener("click", function () {
    let produtosCesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || []
    const indice = produtosCesto.findIndex(p => p.title === produto.title)
    if (indice !== -1) {
      produtosCesto.splice(indice, 1)
    }
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosCesto))
    atualizaCesto()
  })

  article.append(titulo, imagem, descricao, preco, botaoRemover)
  return article
}

function atualizarTotal() {
  let produtosCesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || []
  let total = 0
  produtosCesto.forEach(produto => {
    total += produto.price
  })
  document.getElementById("total-preco").textContent = total + " €"
}
