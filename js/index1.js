
let currentPage = 1; // Página inicial
const usersPerPage = 12; // Quantidade de usuários por página

window.onload = (event) => {
  listarUsuarios(currentPage);
};

async function listarUsuarios(currentPage) {
  try {
    const response = await fetch('usuarios_mock.json');
    
    const users = await response.json();

    const usersHtml = users.map(user => {
      return `
        <tr>
          <td>${user.id}</td>
          <td>${user.name.firstname} ${user.name.lastname}</td>
          <td>${user.email}</td>
          <td>${user.username}</td>
          <td>${user.phone}</td>
        </tr>
      `;
    });

    document.getElementById("lista-usuarios").innerHTML = usersHtml.join("");
  } catch (e) {
    console.log(e.message);
  }
}

// Funções para navegação
function proximaPagina() {
  currentPage++;
  listarUsuarios(currentPage);
}

function paginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    listarUsuarios(currentPage);
  }
}

/*
document.addEventListener("DOMContentLoaded", function () {
  listarUsuarios(currentPage);
});
*/