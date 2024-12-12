/*  Arquivo app-json.js 
    Funções:
        inicializarApp()
        handleDeleteUser()
*/

//  A Função inicializarApp() executa assim que o HTML é carregado na página
document.addEventListener("DOMContentLoaded", function () {
  inicializarApp();
});

// Função inicializarApp()
async function inicializarApp() {
  // Try tenta executar o bloco de comandos
  try {
    // Executa a função consultarUsuariosAPI() definida em api-json.js
    // Retorna arquivo JSON para a constante "users"
    const users = await consultarUsuariosAPI();

    // Executa a função listarUsuarios() definida em dom-json.js
    // Passa como parâmetro o JSON (users) retornado de consultarUsuariosAPI()
    listarUsuarios(users);
  } catch (error) {
    // Em caso de erro na execução dos comandos do bloco "try" executa o "catch"
    mostrarAlerta("Erro ao consultar usuários (api-json). Ver Console.");

    throw new Error(
      `Erro ao consultar usuários (api-json): ${response.statusText}`
    );
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
