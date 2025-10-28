const modal = document.getElementById('modalCadastro');
const tabela = document.getElementById('tabelaUsuarios').getElementsByTagName('tbody')[0];

document.getElementById('btnCadastrar').onclick = () => modal.style.display = 'flex';
function fecharModal() { modal.style.display = 'none'; }

function salvarUsuario() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const perfil = document.getElementById('perfil').value;

  if (!nome || !email || !perfil) {
    alert('Preencha todos os campos.');
    return;
  }

  const novaLinha = tabela.insertRow();
  novaLinha.innerHTML = `
    <td>${nome}</td>
    <td>${email}</td>
    <td>${perfil}</td>
    <td>
      <button onclick="editarUsuario(this)">Editar</button> |
      <button onclick="excluirUsuario(this)">Excluir</button>
    </td>`;

  fecharModal();
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('perfil').value = '';
}

function excluirUsuario(btn) {
  if (confirm('Deseja realmente excluir este usuário?')) {
    btn.parentElement.parentElement.remove();
  }
}

function editarUsuario(btn) {
  const row = btn.parentElement.parentElement;
  const nome = prompt('Editar nome:', row.cells[0].innerText);
  const email = prompt('Editar email:', row.cells[1].innerText);
  const perfil = prompt('Editar perfil:', row.cells[2].innerText);

  if (nome && email && perfil) {
    row.cells[0].innerText = nome;
    row.cells[1].innerText = email;
    row.cells[2].innerText = perfil;
  }
}
