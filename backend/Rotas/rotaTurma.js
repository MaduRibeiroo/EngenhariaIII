//Associar os métodos da camada de controle de produto 
//à requisições GET, POST, PUT, PATCH e DELETE HTTP

import { Router } from "express"; //micro-aplicação HTTP
import TurmaCtrl from "../Controle/turmaCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const turmCtrl = new TurmaCtrl();
const rotaTurma = Router();

rotaTurma.post("/", autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"),turmCtrl.gravar);
rotaTurma.put("/:id", autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"),turmCtrl.editar);
rotaTurma.patch("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), turmCtrl.editar);
rotaTurma.delete("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), turmCtrl.excluir);
rotaTurma.get("/:id",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"), turmCtrl.consultar);
rotaTurma.get("/",autenticarToken, autorizarNivel("1", "2", "4", "3","5", "6"),turmCtrl.consultar);

export default rotaTurma;


