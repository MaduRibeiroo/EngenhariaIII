
import EventoTurmaDAO from "../Persistencia/eventoTurmasDAO.js";
import Evento from "./evento.js";
import Turma from "./turma.js";

export default class EventoTurmas{

    #evento
    #turma

    get evento(){
        return this.#evento?  this.#evento: null;
    }

    set evento(novoEvento){
        if(novoEvento instanceof Evento){
            this.#evento = novoEvento;
        }
    }

    get turma(){
        return this.#turma? this.#turma: null
    }

    set turma(novaTurma){
        if(novaTurma instanceof Turma){
            this.#turma = novaTurma;
        }
    }

    constructor(evento = {}, turma = {}) {
        this.#evento = evento;
        this.#turma = turma;
    }

    toJSON() {
        return {
            evento: this.#evento,
            turma: this.#turma
        };
    }

    async incluir(conexao) {
            const eventoTurmasDAO = new EventoTurmaDAO();
            return eventoTurmasDAO.incluir(this, conexao);
        }
    
    
        /*async alterar(conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
             return alunoResponsavelDAO.alterar(this, conexao);
        }*/
    
    
        async excluir(conexao) {
            const eventoTurmasDAO = new EventoTurmaDAO();
           return eventoTurmasDAO.excluir(this, conexao);
        }

        async excluirPorTurma(conexao) {
            const eventoTurmasDAO = new EventoTurmaDAO();
            return eventoTurmasDAO.excluirPorTurma(this, conexao);
        }
    
    
        async consultar(termo,tipo ,conexao) {
            const eventoTurmasDAO = new EventoTurmaDAO();
            return eventoTurmasDAO.consultar(termo, tipo ,conexao);
        }

}