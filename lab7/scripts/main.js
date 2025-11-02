document.addEventListener("DOMContentLoaded", () => {
  fetchCategorias()
  fetchProdutos()
  document.getElementById("ordenar").addEventListener("change", aplicarFiltros)
  document.getElementById("procurar").addEventListener("change", aplicarFiltros)
  document.getElementById("comprar").addEventListener("click", fetchBuy)
})

let todosOsProdutos = [] 
function fetchCategorias() {
  fetch("https://deisishop.pythonanywhere.com/categories/")
    .then(response => response.json())
    .then(categorias => {
      const select = document.getElementById("filtro")
      categorias.forEach(categoria => {
        select.innerHTML += `<option value="${categoria}">${categoria}</option>`
      })

      select.addEventListener("change", () => {
        aplicarFiltros()
      })
    })
}

function fetchProdutos() {
  fetch("https://deisishop.pythonanywhere.com/products/")
    .then(response => response.json())
    .then(data => {
      todosOsProdutos = data 
      carregarProdutos(data)
    })
    .catch(error => console.error("Erro ao carregar produtos:", error))
}

function aplicarFiltros() {
  const categoria = document.getElementById("filtro").value
  const ordenacao = document.getElementById("ordenar").value
  const input = document.getElementById("procurar").value

  let produtosFiltrados = [...todosOsProdutos]

  if (categoria !== "" && categoria !== "Todas as categorias") {
    produtosFiltrados = produtosFiltrados.filter(p => p.category === categoria)
  }

  if(input){
    produtosFiltrados = produtosFiltrados.filter(p => p.title.includes(input))
}

  if (ordenacao === "asc") {
    produtosFiltrados.sort((a, b) => a.price - b.price)
  } else if (ordenacao === "desc") {
    produtosFiltrados.sort((a, b) => b.price - a.price)
  }


  carregarProdutos(produtosFiltrados)
}
function fetchBuy() {
  const estudante = document.getElementById("estudante").checked
  const cupao = document.getElementById("cupao").value
  const nome = document.getElementById("nome").value

  const produtosCesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || []

  const produtosIDs = produtosCesto.map(p => p.id)

  const body = {
    products: produtosIDs,
    student: estudante,
    coupon: cupao,
    name: nome
  }

  fetch("https://deisishop.pythonanywhere.com/buy/", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  .then(response => response.json())

  .then(data => {
    `${data.message}\nTotal: ${data.totalCost} €\nReferência: ${data.reference}`
    localStorage.removeItem("produtos-selecionados")
    atualizaCesto()
  })

  .catch(error => {
    console.error(error)
    alert("Erro ao processar a compra: " + error.message)
  })
}

function carregarProdutos(lista) {
  const secaoProdutos = document.querySelector("#lista-produtos")
  secaoProdutos.innerHTML = ""
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
