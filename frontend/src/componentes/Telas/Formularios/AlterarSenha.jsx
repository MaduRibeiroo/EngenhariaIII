import { useState } from "react";
import { Alert, Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useLogin } from "../../../LoginContext";
import "../../css/alterarSenha.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AlterarSenha(){

    const [mensagem, setMensagem] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenha2, setMostrarSenha2] = useState(false);
    const [mostrarSenha3, setMostrarSenha3] = useState(false);
    const {funcionario, logout} = useLogin();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 

    const verificarVoltar= async (event)=>{
        event.preventDefault();

        if(window.confirm("Deseja realmente voltar? O processo nao sera concluido.")){
            navigate("/dadosUsuario");
            return;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        if(novaSenha!==confirmarSenha){
            setMensagem("Novas senhas não sao iguais!");
            return;
        }else if(senhaAtual==novaSenha){
            setMensagem("Senha atual e antiga são iguais!");
            return;
        }

        const url = `http://localhost:3000/alterarSenha`;
        const method = "PUT";
        console.log(token);
        try {

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                 },
                
                body: JSON.stringify({email: funcionario.email,
                senhaAtual: senhaAtual,
                novaSenha: novaSenha})
            });

            if (response.ok) {
                setMensagem("Senha alterada com sucesso! Aguarde para fazer login novamente.");
                setTimeout(() => setMensagem(""), 3000);
                setTimeout(() => {
                    logout();
                    navigate("/");
                }, 3000); 
            } 
            else {
                setMensagem("Erro ao atualizar senha!");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };
    return(
        <div>
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Alterar Senha</h2>
            </Alert>
            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
            </Alert>} 
            <div className="divForm">
                <Form onSubmit={handleSubmit} id="formularioLogin"  className="formularioD">
                    <Form.Group className="campoSenhaAtual" controlId="senhaAtual">
                        <Form.Label>Senha Atual</Form.Label>
                        <Form.Control type={mostrarSenha ? "text" : "password"} placeholder="Digite a senha atual" 
                        required
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}/>
                        <InputGroup.Text onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </Form.Group>
                    <Form.Group className="campoNovaSenha" controlId="novaSenha">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control type={mostrarSenha2 ? "text" : "password"} placeholder="Digite a senha nova" 
                        required
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}/>
                        <InputGroup.Text onClick={() => setMostrarSenha2(!mostrarSenha2)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </Form.Group>
                    <Form.Group className="campoConfirmarSenha" controlId="confirmarSenha">
                        <Form.Label>Confirme a senha nova</Form.Label>
                        <Form.Control type={mostrarSenha3 ? "text" : "password"} placeholder="Digite a senha nova" 
                        required
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}/>
                        <InputGroup.Text onClick={() => setMostrarSenha3(!mostrarSenha3)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" onClick={verificarVoltar}>
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar">
                            Alterar Senha
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}