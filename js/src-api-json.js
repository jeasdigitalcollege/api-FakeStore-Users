/*  Arquivo api-json.js 
    Funções:
        consultarUsuariosAPI()
        calcularProximoIdAPI()
        criarUsuarioAPI()
        deleteUserAPI()
*/

// Inicializa UrL da API
const API_URL = "http://localhost:3000/user";

// Função para listar usuários
async function consultarUsuariosAPI() {
  try {
    const response = await fetch(API_URL);

    if (response.ok) return await response.json();
    else {
      const errorMessage = await response.text();
      throw new Error(
        `Erro ao consultar usuários: ${response.status} - ${errorMessage}`
      );
    }
  } catch (error) {
    console.error("Erro ao consultar usuários: (api-json.js - Catch)", error);
    // throw error; // Re-lance o erro para ser capturado em um nível superior, se necessário
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
