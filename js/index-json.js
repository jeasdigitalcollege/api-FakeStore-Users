/*  Arquivo index-json.js */
// ========================================
// Funções do APP

//  A Função inicializarApp() executa assim que o HTML é carregado na página
document.addEventListener("DOMContentLoaded", function () {
  inicializarApp();
});

// Função inicializarApp()
async function inicializarApp() {
  // Essa função executa os seguintes procedimentos:
  // 1. Consulta lista usuários da API
  // 2. Configura o event listener para submissão do formulário de inclusão de clientes
  // --------------------------------------------------------
  try {
    // Executa a função consultarUsuariosAPI()
    // Retorna arquivo JSON para a constante "users"
    const users = await consultarUsuariosAPI();

    // Executa a função listarUsuarios()
    // Passa como parâmetro o JSON (users) retornado de consultarUsuariosAPI()
    listarUsuarios(users);
  } catch (error) {
    // Em caso de erro na execução dos comandos do bloco "try" executa o "catch"

    console.error("inicializarApp - Catch - Console: ", error);
    mostrarAlerta("inicializarApp - Catch - Alert: " + error);

    /*
    throw new Error(
      `Erro ao consultar usuários (api-json): ${error.statusText}`
    );*/
  }

  // Configura o event listener para submissão do formulário
  // A função é executada quando o botão "Salvar" do formulário for acionado
  document.getElementById("form-new-user").onsubmit = async function (e) {
    e.preventDefault();

    try {
      // Calcula um Id para o próximo usuário que será adicionado ao arquivo JSON
      const nextId = await calcularProximoIdAPI();

      // Inicializa os atributos do registro que será adicionado ao arquivo JSON
      const user = {
        id: nextId,
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

      // Executa a função para adicionar registro JSON
      await criarUsuarioAPI(user);

      // Executa a função que consulta a nova lista de usuários do JSON
      //const users = await consultarUsuariosAPI();

      listarUsuarios();
      fecharModal();
      limparFormulario();
    } catch (error) {
      console.error("Erro ao incluir o registro: (app-json.js)", error);
      mostrarAlerta("Erro ao incluir o registro. (app-json.js");
    }
  };
}

// Função para lidar com a exclusão de um usuário
async function handleDeleteUser(userId) {
  const confirmDelete = confirm(
    `Tem certeza de que deseja excluir o usuário com ID ${userId}?`
  );

  if (confirmDelete) {
    try {
      await deleteUserAPI(userId);
      console.log("Usuário excluído com sucesso (app-json.js)");
      mostrarAlerta("Usuário excluído com sucesso. (app-json.js)");
      const users = await consultarUsuariosAPI();
      listarUsuarios(users);
    } catch (error) {
      console.error("Erro ao excluir usuário: (app-json.js)", error);
      mostrarAlerta("Erro ao excluir usuário. (app-json.js)");
    }
  }
}

// ========================================
// Funções da API

// Inicializa URL da API
const API_URL = "http://localhost:3000/users";

// Função para consultar usuários na API JSON
// async indica que a função é assíncrona, ou seja, ela pode realizar operações que levam tempo,
// como requisições à rede, sem bloquear a execução do código.
async function consultarUsuariosAPI() {
  // Inicia um bloco de código que pode gerar erros.
  // Tudo o que estiver dentro desse bloco será monitorado para possíveis exceções.
  try {
    // Faz uma requisição à API especificada em API_URL e aguarda a resposta.
    // await: É usado para esperar a conclusão da promessa retornada por fetch.
    const response = await fetch(API_URL);

    // Verifica se a requisição foi bem-sucedida (status 200).
    // Se a requisição foi bem-sucedida, converte a resposta em um objeto JSON e retorna esse objeto.
    if (response.ok) return await response.json();
    else {
      // Obtém o texto da mensagem de erro da resposta.
      const errorMessage = await response.text();
      // Lança um novo erro com uma mensagem personalizada que inclui o código de status da resposta e a mensagem de erro.
      // Esse erro será capturado pelo bloco catch.
      throw new Error(
        `consultarUsuariosAPI - Catch - Alert! Código Erro: ${response.status} Mensagem: ${errorMessage}`
      );
    }
    // Inicia o bloco catch, que será executado se ocorrer algum erro dentro do bloco try.
    // "e" variável que recebe o objeto de erro lançado.
    // Esse objeto contém informações sobre o erro, como a mensagem, o tipo de erro e a pilha de chamadas.
  } catch (e) {
    // console.error: Utiliza o método console.error para registrar a mensagem como um erro,
    // destacando-a no console do navegador.
    console.error(
      `consultarUsuariosAPI - Catch - Console! 
      - Mensagem: ${e.message}
      - Tipo de erro: ${e.name}
      - Stack Trace: ${e.stack}`
    );
    mostrarAlerta(e);
  }
}

// Função para calcular o próximo ID
async function calcularProximoIdAPI() {
  try {
    const usuarios = await consultarUsuariosAPI();
    const ids = usuarios.map((usuario) => parseInt(usuario.id, 10));
    const maiorId = Math.max(...ids);
    return (maiorId + 1).toString();
  } catch (error) {
    console.error("Erro ao calcular próximo ID: (api-json.js)", error);
    mostrarAlerta("Erro ao calcular próximo Id. (api-json.js)");

    throw error;
  }
}

// Função para criar um usuário
async function criarUsuarioAPI(user) {
  try {
    const params = {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(API_URL, params);

    if (!response.ok) {
      throw new Error(`Erro ao incluir usuário: ${response.statusText}`);
    } else {
      const data = await response.json();
      console.log("Usuário incluído com sucesso:", data);
      mostrarAlerta("Usuário incluído com sucesso! (api-json.js)");

      // Buscar a lista de usuários novamente após a criação
      //const users = await consultarUsuariosAPI();
      //listarUsuarios(users);

      return data;
    }
  } catch (error) {
    console.error("Erro ao incluir usuário: (api-json.js)", error);
    mostrarAlerta("Erro ao incluir usuário. (api-json.js)");
  }
}

// Função para excluir um usuário
async function deleteUserAPI(userId) {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao excluir usuário");
    }
    return true;
  } catch (error) {
    console.error("Erro ao excluir usuário: (api-json.js)", error);
    mostrarAlerta("Erro ao excluir usuário. (api-json.js)");
    throw error;
  }
}

// ========================================
// Funções do DOM

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

/*
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
  */

// Função para mostrar mensagens de alerta
function mostrarAlerta(mensagem) {
  alert(mensagem);
}
