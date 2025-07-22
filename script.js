
class Item {
  constructor(nome, descricao, categoria) {
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
  }
}
// ------------------------------------------------------------------------------------------------------------------------------------
// função para mostrar os campos de descrição e do item
function mostrarCampoTipo() {
  const tipoSelecionado = document.getElementById("tipo-item").value;
  const campoDetalhado = document.getElementById("detalhes-item");
  const campoDescricao = document.getElementById("descricao-item");

  if (tipoSelecionado !== "") {
    campoDetalhado.style.display = "block";
    campoDescricao.style.display = "block";
  } else {
    campoDetalhado.style.display = "none";
    campoDescricao.style.display = "none";
  }
}
// ------------------------------------------------------------------------------------------------------------------------------------

// Função para cadastrar novo item pelo formulário
function cadastrarItem(event) {
  event.preventDefault();

  const tipoItem = document.getElementById("tipo-item")?.value;
  const tipoDetalhado = document.getElementById("tipo-detalhado").value.trim();
  const descricaoItem = document.getElementById("descricao").value.trim();
  const msg = document.getElementById("msg-sucesso");

  const novoItem = new Item(tipoDetalhado, descricaoItem, tipoItem);
  const itens = JSON.parse(localStorage.getItem("itens")) || [];
  itens.push(novoItem);
  localStorage.setItem("itens", JSON.stringify(itens));

  if (msg) {
    msg.style.display = "block";
    msg.textContent = `${tipoItem} chamado "${tipoDetalhado}" cadastrado com sucesso!`;
    msg.style.color = "green";
  }

  document.getElementById("form-coleta").reset();

  mostrarCampoTipo();
}

// ------------------------------------------------------------------------------------------------------------------------------------

// Função para carregar lista de itens na página de listagem
function carregarLista(filtro = "") {
  const listaUl = document.getElementById("lista-itens");

  listaUl.innerHTML = "";
  const itens = JSON.parse(localStorage.getItem("itens")) || [];

  const itensFiltrados = itens.filter(item =>
    item.nome.toLowerCase().includes(filtro) ||
    item.categoria.toLowerCase().includes(filtro) ||
    item.descricao.toLowerCase().includes(filtro)
  );

  if (itensFiltrados.length === 0) {
    listaUl.innerHTML = "<li>Nenhum item encontrado.</li>";
  } else {
    itensFiltrados.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("item-listado");

      li.innerHTML = `
        <strong>Categoria:</strong> ${item.categoria}<br>
        <strong>Nome:</strong> ${item.nome}<br>
        <strong>Descrição:</strong> ${item.descricao || "Sem descrição"}<br>
        <button class="botao-remover" onclick="removerItem(${index})">Remover</button>
      `;
      

      listaUl.appendChild(li);
    });
    
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------

// Função para remover item com confirmação
function removerItem(index) {
  if (!confirm("Tem certeza que deseja remover este item?")) return;

  let itens = JSON.parse(localStorage.getItem("itens")) || [];
  itens.splice(index, 1);
  localStorage.setItem("itens", JSON.stringify(itens));
  
  // Atualiza a lista com filtro atual, se houver
  const filtro = document.getElementById("barra-pesquisa").value.toLowerCase() || "";
  carregarLista(filtro); 

}

// ------------------------------------------------------------------------------------------------------------------------------------

// Inicialização após o carregamento da página

window.onload = () => {
  // Página de cadastro
  if (document.getElementById("form-coleta")) {
    // Esconde os campos detalhados inicialmente
    mostrarCampoTipo();

    // Liga evento onchange no select tipo-item
    document.getElementById("tipo-item").addEventListener("change", mostrarCampoTipo);

    // Liga evento submit do formulário
    document.getElementById("form-coleta").addEventListener("submit", cadastrarItem);

    // Esconde mensagem de sucesso inicialmente
    const msg = document.getElementById("msg-sucesso");
    if (msg) msg.style.display = "none";
  }

  // Página de listagem
  if (document.getElementById("lista-itens")) {
    // Carrega lista completa inicialmente
    carregarLista();

    // Liga evento input da barra de pesquisa
    document.getElementById("barra-pesquisa").addEventListener("input", (e) => {
      const filtro = e.target.value.toLowerCase();
      carregarLista(filtro);
    });
  }
};