const { response } = require("express");
const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

// Metodos HTTP:
// GET: Buscar informações do back-end
// POST: Criar informação no back-end
// PUT/PATCH: Alterar uma informação no back-end
// DELETE: Deletar uma informação no back-end

// Tipos de parametros
// Query Params: Filtros e paginação
// Rout Params: Identificar recursos na gora de atualizar e deletar
// Request Body: Conteudo na gora de criar ou editar um recurso(JSON)

//Middleware:
//Interceptador de requisições, que pode interromper totalmente a requisição ou alterar os dados da requisição

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = "[" + method + "] " + url;

  console.time(logLabel);
  
  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);//escolho qual rota ele vai usar o middlewares

app.get("/projects", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : results;
  //Nessa parte result vai receber o titulo, vai fazer um if comparando se esse titulo esta dentro de project, se estiver vai retornar results contendo o project
  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id == id); //vai procurar um projet dentro de projects que o id seja igual o fornecido e vai armazenar esse index project em um index

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  projects.splice(projectIndex, 1); //retira um conteudo de uma array(passa o index e quantas posiçoes vai remover a partir desse index)

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("🚀 Back-end started");
});
