// Arquivo index-json.js

document.addEventListener("DOMContentLoaded", function () {
  listarUsuarios();

  document.getElementById("form-new-user").onsubmit = async (e) => {
    e.preventDefault();

    // Obtém o próximo ID antes de criar o usuário
    const nextId = await calcularProximoId();

    const user = {
      id: nextId, // Adiciona o ID gerado ao objeto do usuário
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      name: {
        firstname: document.getElementById("firstName").value,
        lastname: document.getElementById("lastName").value,
      },
      address: {
        city: document.getElementById("cidade").value,
        street: document.getElementById("rua").value,
        number: document.getElementById("numero").value,
        zipercode: document.getElementById("cep").value,
        geolocation: {
          lat: document.getElementById("latitude").value,
          long: document.getElementById("longitude").value,
        },
      },
      phone: document.getElementById("telefone").value,
    };

    criarUsuario(user);
  };
});

async function listarUsuarios() {
  try {
    const response = await fetch(`http://localhost:3000/users`);

    const users = await response.json();

    const usersHtml = users.map((user) => {
      return `
          <tr>
            <td>${user.id}</td>
            <td>${user.name.firstname + " " + user.name.lastname}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.phone}</td>

            <td class="text-center"><a ref="#" ><img src="images/magnifying-glass-solid.svg" alt="Consultar" width="20px" height="20px"></a></td>
            <td class="text-center"><a ref="#" ><img src="images/pen-to-square-solid.svg" alt="Editar" width="20px" height="20px"></a></td>
            <td class="text-center"><a ref="#" onclick="deleteUser(${
              user.id
            })"><img src="images/trash-solid.svg" alt="Deletar" width="20px" height="20px"></a></td>
          </tr>
        `;
    });

    document.getElementById("lista-usuarios").innerHTML = usersHtml.join("");
  } catch (e) {
    console.log(e);
    return;
  }
}

// Cria o "id" para o registro a ser incluído
async function calcularProximoId() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const usuarios = await response.json();

    // Extrai os IDs como números
    const ids = usuarios.map((usuario) => parseInt(usuario.id, 10));

    // Encontra o maior ID atual
    const maiorId = Math.max(...ids);

    // Retorna o próximo ID como string
    return (maiorId + 1).toString();
  } catch (error) {
    console.error("Erro ao calcular próximo ID:", error);
    return null; // Retorna null em caso de erro
  }
}

async function criarUsuario(user) {
  try {
    const params = {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        //instrução não obrigatório
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("http://localhost:3000/users", params);

    console.log("Response status:", response.status);

    if (!response.ok) {
      //console.log("Erro ao salvar o usuário RESPONSE")
      alert("Erro no FETCH");
    } else {
      alert("Registro incluído com sucesso!!!");
    }

    listarUsuarios();
    fecharModal();
    limparForm();
  } catch (e) {
    //console.log("Erro ao salvar o usuário CATCH ")
    alert("Erro no CATCH");
  }
}

function fecharModal() {
  const modalElement = document.getElementById("form-usuario");
  const modal = bootstrap.Modal.getInstance(modalElement);

  modal.hide();
}

function limparForm() {
  document.getElementById("email").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("rua").value = "";
  document.getElementById("numero").value = "";
  document.getElementById("cep").value = "";
  document.getElementById("latitude").value = "";
  document.getElementById("longitude").value = "";
  document.getElementById("telefone").value = "";
}

async function deleteUser(userId) {
  const confirmDelete = confirm(
    `Tem certeza de que deseja excluir o usuário com ID ${userId}?`
  );

  if (confirmDelete) {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Usuário excluído com sucesso.");
        listarUsuarios(); // Atualize a tabela diretamente.
      } else {
        alert("Erro ao excluir usuário.");
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro no CATCH ao excluir o usuário.");
    }
  }
}

// Função para remover a linha do usuário da tabela
function removeUserFromTable(userId) {
  // Encontre a linha do usuário na tabela e remova
  const table = document.querySelector("#lista-usuarios");
  const rowToDelete = Array.from(table.rows).find(
    (row) => row.cells[0].textContent == userId
  );

  if (rowToDelete) {
    table.deleteRow(rowToDelete.rowIndex - 1); // Subtraia 1 porque o índice da linha inclui o cabeçalho
    alert(`Usuário com ID ${userId} removido da tabela.`);
  } else {
    alert("Linha do usuário não encontrada.");
  }
}
