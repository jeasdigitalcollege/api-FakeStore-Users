// Arquivo index-api.js

window.onload = (event) => {
  listarUsuarios();
};

async function listarUsuarios() {
  try {
    const response = await fetch(`https://fakestoreapi.com/users`);
    
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

/* Outra forma de carregar os dados da API após carregar a página
document.addEventListener("DOMContentLoaded", function () {
  listarUsuarios(currentPage);
});
*/