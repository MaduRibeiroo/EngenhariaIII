import { Router } from "express"; 
import EscolaCtrl from "../Controle/escolaCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const escolaCtrl = new EscolaCtrl();
const rotaEscola = Router();

rotaEscola.post("/", autenticarToken, autorizarNivel("1", "2"),escolaCtrl.gravar);
rotaEscola.put("/:id",autenticarToken, autorizarNivel("1", "2"), escolaCtrl.editar);
rotaEscola.patch("/:id",autenticarToken, autorizarNivel("1", "2"), escolaCtrl.editar);
rotaEscola.delete("/:id",autenticarToken, autorizarNivel("1", "2"), escolaCtrl.excluir);
rotaEscola.get("/:id",autenticarToken, autorizarNivel("1", "2"), escolaCtrl.consultar);
rotaEscola.get("/",autenticarToken, autorizarNivel("1", "2"),escolaCtrl.consultar);

export default rotaEscola;


