//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Responsavel from "../Modelo/responsavel.js";
import conectar from "../Persistencia/Conexao.js";

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    // Elimina CPFs conhecidos inválidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validarDataNascimento(dtNascimento) {
    if (!dtNascimento) return false;

    const hoje = new Date();
    const nascimento = new Date(dtNascimento);

    if (isNaN(nascimento.getTime())) return false; // data inválida

    // Verifica se a data de nascimento é futura
    if (nascimento > hoje) return false;

    // Calcula a idade
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    // Verifica se tem 18 anos ou mais
    return idade >= 18;
}

export default class ResponsavelCtrl {

    async gravar(requisicao, resposta){
        resposta.type("application/json");
        
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const cpf  = requisicao.body.cpf;
            const rg = requisicao.body.rg;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
            const email = requisicao.body.email;
            const sexo = requisicao.body.sexo;
            const dtNascimento = requisicao.body.dtNascimento;
            const estCivil = requisicao.body.estCivil;
            const conjuge = requisicao.body.conjuge;
            const profissao = requisicao.body.profissao;
            const situTrabalho = requisicao.body.situTrabalho;
            const escolaridade = requisicao.body.escolaridade;
            const rendaFamiliar = requisicao.body.rendaFamiliar;
            const valorRenda = requisicao.body.valorRenda;
            const qtdeTrabalhadores = requisicao.body.qtdeTrabalhadores;
            const pensaoAlimenticia = requisicao.body.pensaoAlimenticia;
            const valorPensao = requisicao.body.valorPensao;
            const pagadorPensao = requisicao.body.pagadorPensao;
            const beneficioSocial = requisicao.body.beneficioSocial;
            const tipoBeneficio = requisicao.body.tipoBeneficio;
            const valorBeneficio = requisicao.body.valorBeneficio;
            const beneficiario = requisicao.body.beneficiario;

            console.log("Controle responsavel:"+JSON.stringify(requisicao.body, null, 2));

            if (!validarCPF(cpf)) {
                throw new Error("CPF inválido");
            }

           
            if (!validarDataNascimento(dtNascimento)) {
                throw new Error("Não é possível cadastrar um menor de idade.");
            }

            if (cpf && rg && nome && telefone && email && sexo && dtNascimento && conjuge && estCivil && situTrabalho && escolaridade && rendaFamiliar && qtdeTrabalhadores>=0 && pensaoAlimenticia && beneficioSocial)
            {
                
                let conexao;
                const responsavel = new Responsavel(cpf, rg, nome, telefone, email, sexo, dtNascimento, estCivil, conjuge, profissao, situTrabalho, escolaridade, rendaFamiliar, valorRenda, qtdeTrabalhadores, pensaoAlimenticia, valorPensao, pagadorPensao, beneficioSocial, tipoBeneficio, valorBeneficio, beneficiario);
           
                try{
                    conexao=await conectar();
                    await conexao.query("BEGIN");
                    if(pensaoAlimenticia=='Sim' ){
                        if(valorPensao<=0 || !pagadorPensao){
                            await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    if(beneficioSocial==='Sim'){
                        if(!tipoBeneficio || valorBeneficio<=0 || !beneficiario){
                            await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    if(!rendaFamiliar.includes("Nao")){
                        if(valorRenda==null || valorRenda<=0){
                            if(conexao)
                                await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    if(situTrabalho=="Empregado"){
                        if(profissao==null){
                            if(conexao)
                                await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    const resultado = await responsavel.incluir(conexao);
                    
                    if(resultado){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Responsavel adicionado com sucesso!",
                            "cpf": responsavel.cpf
                        });
                    }
                    else{
                        if(conexao)
                            await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível incluir o responsavel: " + erro.message
                        });
                    }
                }catch(erro){
                    await conexao.query("ROLLBACK");

                    let statusCode = 500;
                    let tipoErro = "ErroDesconhecido";

                    if (erro.message.includes("CPF inválido")) {
                        statusCode = 400;
                        tipoErro = "ErroValidacao";
                    } else if (erro.message.includes("RG inválido")) {
                        statusCode = 400;
                        tipoErro = "ErroValidacao";
                    } else if (erro.message.includes("Não é possível cadastrar um menor de idade.")) {
                        statusCode = 400;
                        tipoErro = "ErroValidacao";
                    } 
                    else if (erro.message.includes("CPF já cadastrado.")) {
                        statusCode = 400;
                        tipoErro = "ErroDuplicado";
                    } else if (erro.message.includes("RG já cadastrado.")) {
                        statusCode = 400;
                        tipoErro = "ErroDuplicado";
                    }else if (erro.message.includes("Email já cadastrado.")) {
                        statusCode = 400;
                        tipoErro = "ErroDuplicado";
                    }else if (erro.message.includes("Erro ao incluir")) {
                        statusCode = 500;
                        tipoErro = "ErroBancoDeDados";
                    }
                    // Pode adicionar outros ifs para outros erros que quiser

                    resposta.status(statusCode).json({
                        status: false,
                        tipo: tipoErro,
                        mensagem: erro.message
                    });
                }finally {
                    if(conexao)
                        conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                    }
                );
            }

        }
        else
        {
            resposta.status(400).json({
                "status":false,
                "mensagem":"Requisição inválida! Consulte a documentação da API."
            });

        }

    }

    async editar(requisicao, resposta){
    
        resposta.type("application/json");
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")){
       
            const cpf  = requisicao.params.cpf;
            const rg = requisicao.body.rg;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
            const email = requisicao.body.email;
            const sexo = requisicao.body.sexo;
            const dtNascimento = requisicao.body.dtNascimento;
            const estCivil = requisicao.body.estCivil;
            const conjuge = requisicao.body.conjuge;
            const profissao = requisicao.body.profissao;
            const situTrabalho = requisicao.body.situTrabalho;
            const escolaridade = requisicao.body.escolaridade;
            const rendaFamiliar = requisicao.body.rendaFamiliar;
            const valorRenda = requisicao.body.valorRenda;
            const qtdeTrabalhadores = requisicao.body.qtdeTrabalhadores;
            const pensaoAlimenticia = requisicao.body.pensaoAlimenticia;
            const valorPensao = requisicao.body.valorPensao;
            const pagadorPensao = requisicao.body.pagadorPensao;
            const beneficioSocial = requisicao.body.beneficioSocial;
            const tipoBeneficio = requisicao.body.tipoBeneficio;
            const valorBeneficio = requisicao.body.valorBeneficio;
            const beneficiario = requisicao.body.beneficiario;
        
            if (cpf && rg && nome && telefone && email && sexo && dtNascimento && conjuge && estCivil && situTrabalho && escolaridade && rendaFamiliar && valorRenda>0.00 && qtdeTrabalhadores>=0 && pensaoAlimenticia && beneficioSocial)
            {

                let conexao;
                const responsavel = new Responsavel(cpf, rg, nome, telefone, email, sexo, dtNascimento, estCivil, conjuge, profissao, situTrabalho, escolaridade, rendaFamiliar, valorRenda, qtdeTrabalhadores, pensaoAlimenticia, valorPensao, pagadorPensao, beneficioSocial, tipoBeneficio, valorBeneficio, beneficiario);
                
                try{
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    if(pensaoAlimenticia=='Sim' ){
                        if(valorPensao<=0 || !pagadorPensao){
                            await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    if(beneficioSocial=='Sim'){
                        if(!tipoBeneficio || valorBeneficio<=0 || !beneficiario){
                            await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    if(!rendaFamiliar.includes("Nao")){
                        if(valorRenda==null || valorRenda<=0){
                            if(conexao)
                                await conexao.query("ROLLBACK");
                            return resposta.status(400).json(
                            {
                                "status":false,
                                "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                            });
                        }
                    }
                    //const resultado = await responsavel.alterar(conexao);
                    if(responsavel.alterar(conexao)){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Responsavel alterado com sucesso!",
                        });
                    }
                    else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível alterar o responsavel: " + erro.message
                        });
                    }
                }
                catch(erro){
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível alterar o responsavel: " + erro.message
                    });
                }finally{
                    conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                    }
                );
            }
        }
        else
        {
            resposta.status(400).json({
                "status":false,
                "mensagem":"Requisição inválida! Consulte a documentação da API."
            });

        }
    }

    async excluir(requisicao, resposta) {
    resposta.type("application/json");

    if (requisicao.method == 'DELETE') {
        const cpf = requisicao.params.cpf;

        if (cpf) {
            let conexao;
            const responsavel = new Responsavel(cpf);

            try {
                conexao = await conectar();
                await conexao.query("BEGIN");

                const resultado = await responsavel.excluir(conexao);

                // Verifica se houve alguma linha afetada
                if (resultado.rowCount > 0) {
                    await conexao.query("COMMIT");
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Responsável excluído com sucesso!",
                    });
                } else {
                    await conexao.query("ROLLBACK");
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Responsável não encontrado.",
                    });
                }

            } catch (erro) {
                if (conexao) await conexao.query("ROLLBACK");

                // Verifica se a mensagem de erro contém violação de chave estrangeira
                if (erro.message.includes("violates foreign key constraint")) {
                    resposta.status(400).json({
                        status: false,
                        mensagem: "Não é possível excluir o responsável pois ele está vinculado a um atendido.",
                    });
                } else {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir responsável: " + erro.message,
                    });
                }

            } finally {
                if (conexao) conexao.release();
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Informe um CPF válido de um responsável conforme documentação da API.",
            });
        }
    } else {
        resposta.status(400).json({
            status: false,
            mensagem: "Requisição inválida! Consulte a documentação da API.",
        });
    }
}


    async consultar(requisicao, resposta) {
        
        resposta.type("application/json");
        if (requisicao.method == "GET") {
            let cpf = requisicao.params.cpf;

            //evitar que código tenha valor undefined
            if (!cpf) {
                cpf = "";
            }

            let conexao;
            const responsavel = new Responsavel();
            
            try{
                conexao = await conectar();
                await conexao.query("BEGIN");
                const listaResponsavel = await responsavel.consultar(cpf, conexao);
                
                if(Array.isArray(listaResponsavel)){
                    await conexao.query('COMMIT');
                    resposta.status(200).json(listaResponsavel);
                }
                else{
                    await conexao.query('ROLLBACK');
                    resposta.status(404).json(
                        {
                            "status": false,
                            "mensagem": "Nenhum responsavel encontrado."
                        }
                    );
                }
                    
            }catch(erro) {
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar responsaveis: " + erro.message
                        }
                    );
            }finally{
                if(conexao)
                    conexao.release();
            }

        }
        else {
            resposta.status(400).json(
                {
                    "status": false,
                    "mensagem": "Requisição inválida! Consulte a documentação da API."
                }
            );
        }
    }

}