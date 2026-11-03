const produtos = [
  {
    id: 1,
    nome: "VisionAR Glass",
    categoria: "Wearables",
    descricao: "Óculos inteligentes com recursos de navegação e tradução.",
    preco: 1299.90,
    icone: "🥽"
  },
  {
    id: 2,
    nome: "PulseTouch Pro",
    categoria: "Wearables",
    descricao: "Pulseira inteligente com feedback tátil para games.",
    preco: 349.90,
    icone: "⌚"
  },
  {
    id: 3,
    nome: "AuraRing Control",
    categoria: "Wearables",
    descricao: "Anel inteligente para controle por gestos.",
    preco: 499.90,
    icone: "💍"
  },
  {
    id: 4,
    nome: "HoloDesk AI",
    categoria: "Casa Inteligente",
    descricao: "Assistente de mesa com conceito de projeção holográfica.",
    preco: 1899.90,
    icone: "🤖"
  },
  {
    id: 5,
    nome: "HydroSmart",
    categoria: "Casa Inteligente",
    descricao: "Garrafa inteligente com lembretes de hidratação.",
    preco: 179.90,
    icone: "🧴"
  },
  {
    id: 6,
    nome: "SoundPods X",
    categoria: "Acessórios",
    descricao: "Fones sem fio para música, chamadas e jogos.",
    preco: 259.90,
    icone: "🎧"
  }
];

const elementoProdutos = document.getElementById("lista-produtos");
const pesquisa = document.getElementById("pesquisa");
const filtro = document.getElementById("filtro-categoria");
const mensagemVazia = document.getElementById("mensagem-vazia");
const quantidadeCarrinho =
  document.getElementById("quantidade-carrinho");
const itensCarrinho = document.getElementById("itens-carrinho");
const valorTotal = document.getElementById("valor-total");

const formatarMoeda = valor =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Recupera o carrinho salvo no navegador.
function carregarCarrinho() {
  try {
    const salvo = JSON.parse(
      localStorage.getItem("techstore-carrinho")
    );

    if (!Array.isArray(salvo)) return [];

    return salvo.filter(item =>
      produtos.some(produto => produto.id === item.id) &&
      Number.isInteger(item.quantidade) &&
      item.quantidade > 0
    );
  } catch {
    return [];
  }
}

let carrinho = carregarCarrinho();

function salvarCarrinho() {
  localStorage.setItem(
    "techstore-carrinho",
    JSON.stringify(carrinho)
  );
}

// Cria os cartões de produtos dinamicamente no DOM.
function renderizarProdutos() {
  const termo = pesquisa.value
    .trim()
    .toLocaleLowerCase("pt-BR");

  const categoria = filtro.value;

  const filtrados = produtos.filter(produto => {
    const correspondeNome = produto.nome
      .toLocaleLowerCase("pt-BR")
      .includes(termo);

    const correspondeCategoria =
      categoria === "Todas" ||
      produto.categoria === categoria;

    return correspondeNome && correspondeCategoria;
  });

  elementoProdutos.replaceChildren();

  mensagemVazia.hidden = filtrados.length > 0;

  filtrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "produto";

    const icone = document.createElement("div");
    icone.className = "icone-produto";
    icone.textContent = produto.icone;
    icone.setAttribute("aria-hidden", "true");

    const categoriaEl = document.createElement("p");
    categoriaEl.className = "categoria";
    categoriaEl.textContent = produto.categoria;

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.className = "descricao";
    descricao.textContent = produto.descricao;

    const preco = document.createElement("p");
    preco.className = "preco";
    preco.textContent = formatarMoeda(produto.preco);

    const botao = document.createElement("button");
    botao.className = "botao";
    botao.textContent = "Adicionar ao carrinho";
    botao.addEventListener("click", () => adicionarAoCarrinho(produto.id));

    card.append(
      icone,
      categoriaEl,
      titulo,
      descricao,
      preco,
      botao
    );

    elementoProdutos.appendChild(card);
  });
}

// Adiciona um produto ou aumenta sua quantidade.
function adicionarAoCarrinho(id) {
  const item = carrinho.find(item => item.id === id);

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ id, quantidade: 1 });
  }

  atualizarCarrinho();
}

// Remove uma unidade ou o produto inteiro.
function removerDoCarrinho(id) {
  const item = carrinho.find(item => item.id === id);

  if (!item) return;

  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    carrinho = carrinho.filter(item => item.id !== id);
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  salvarCarrinho();
  renderizarCarrinho();
}

function renderizarCarrinho() {
  itensCarrinho.replaceChildren();

  const quantidadeTotal = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  const total = carrinho.reduce((soma, item) => {
    const produto = produtos.find(p => p.id === item.id);

    return soma + produto.preco * item.quantidade;
  }, 0);

  quantidadeCarrinho.textContent = quantidadeTotal;
  valorTotal.textContent = formatarMoeda(total);

  if (carrinho.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu carrinho está vazio.";
    itensCarrinho.appendChild(mensagem);
    return;
  }

  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const informacao = document.createElement("span");
    informacao.textContent =
      `${produto.nome} × ${item.quantidade} — ` +
      formatarMoeda(produto.preco * item.quantidade);

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "− Remover 1";
    botaoRemover.setAttribute(
      "aria-label",
      `Remover uma unidade de ${produto.nome}`
    );

    botaoRemover.addEventListener("click", () => {
      removerDoCarrinho(produto.id);
    });

    linha.append(informacao, botaoRemover);
    itensCarrinho.appendChild(linha);
  });
}

// Eventos de pesquisa e filtragem.
pesquisa.addEventListener("input", renderizarProdutos);
filtro.addEventListener("change", renderizarProdutos);

// Atalhos para visualizar o carrinho.
document.getElementById("botao-carrinho")
  .addEventListener("click", () => {
    document.getElementById("carrinho").scrollIntoView({
      behavior: "smooth"
    });
  });

document.getElementById("limpar-carrinho")
  .addEventListener("click", () => {
    carrinho = [];
    atualizarCarrinho();
  });

// Inicializa a página.
renderizarProdutos();
renderizarCarrinho();