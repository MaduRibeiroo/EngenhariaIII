import { Router } from "express";
import PresencaCtrl from "../Controle/presencaCtrl.js";
import autenticarToken from "../middleware/autenticarToken.js";
import autorizarNivel from "../middleware/autorizarNivel.js";

const rotaPresenca = Router();
const presencaCtrl = new PresencaCtrl();

rotaPresenca.post('/', autenticarToken, autorizarNivel("1", "2", "4", "3", "6"),presencaCtrl.gravar);
rotaPresenca.get('/', autenticarToken, autorizarNivel("1", "2", "4", "3", "6"), presencaCtrl.consultar);
rotaPresenca.get('/:id', autenticarToken, autorizarNivel("1", "2", "4", "3", "6"), presencaCtrl.consultarPorId);
rotaPresenca.get("/materia/:materiaId/turmas", autenticarToken, autorizarNivel("1", "2", "4", "3", "6"), presencaCtrl.consultarTurmasPorMateria);
rotaPresenca.put('/:id', autenticarToken, autorizarNivel("1", "2", "4", "3", "6"), presencaCtrl.alterar);
rotaPresenca.delete('/:id',autenticarToken, autorizarNivel("1", "2", "4", "3", "6"), presencaCtrl.excluir);

export default rotaPresenca;