/*  Arquivo dom-json.js 
    Funções:
        listarUsuarios()
        limparFormulario()
        fecharModal()
        mostrarAlerta()
*/

// Função para atualizar a lista de usuários no DOM
function listarUsuarios(users) {
  const usersHtml = users.map(
    (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name.firstname} ${user.name.lastname}</td>
          <td>${user.email}</td>
          <td>${user.username}</td>
          <td>${user.phone}</td>
          <td class="text-center"><a href="#"><img src="images/magnifying-glass-solid.svg" alt="Consultar" width="20px" height="20px"></a></td>
          <td class="text-center"><a href="#"><img src="images/pen-to-square-solid.svg" alt="Editar" width="20px" height="20px"></a></td>
          <td class="text-center"><a href="#" onclick="handleDeleteUser(${user.id})"><img src="images/trash-solid.svg" alt="Deletar" width="20px" height="20px"></a></td>
        </tr>
      `
  );

  document.getElementById("lista-usuarios").innerHTML = usersHtml.join("");
}

// Função para limpar o formulário
function limparFormulario() {
  const campos = [
    "email",
    "username",
    "password",
    "firstName",
    "lastName",
    "cidade",
    "rua",
    "numero",
    "cep",
    "latitude",
    "longitude",
    "telefone",
  ];
  campos.forEach((campo) => (document.getElementById(campo).value = ""));
}

// Função para fechar o modal
function fecharModal() {
  const modalElement = document.getElementById("form-usuario");
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();
}

// Função para mostrar mensagens de alerta
function mostrarAlerta(mensagem) {
  alert(mensagem);
}
