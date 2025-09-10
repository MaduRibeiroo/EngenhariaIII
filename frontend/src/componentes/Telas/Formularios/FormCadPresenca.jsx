import { useState, useEffect, useCallback } from "react";
import { Form, Button, Alert, Table, Row, Col, Overlay } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/telaPresenca.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";

export default function FormCadPresenca() {
    const [materias, setMaterias] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedTurma, setSelectedTurma] = useState('');
    const [presencas, setPresencas] = useState({});
    const [mensagem, setMensagem] = useState('');
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if (location.state?.id) {
            setEditando(true);
            setSelectedMateria(location.state.materia.id);
            setSelectedTurma(location.state.turma.id);

            // Atualiza matérias sem duplicatas
            setMaterias(prev => {
                const exists = prev.some(m => m.id === location.state.materia.id);
                return exists ? prev : [...prev, location.state.materia];
            });

            // Atualiza turmas sem duplicatas
            setTurmas(prev => {
                const exists = prev.some(t => t.id === location.state.turma.id);
                return exists ? prev : [...prev, location.state.turma];
            });

            const presencasIniciais = {};
            location.state.alunosPresentes.forEach(ap => {
                presencasIniciais[ap.aluno.id] = ap.presente;
            });
            setPresencas(presencasIniciais);
        }
    }, [location.state]);

    useEffect(() => {
        async function carregarMaterias() {
            try {
                const res = await fetch('http://localhost:3000/materias', {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setMaterias(data);
            } catch (error) {
                setMensagem('Erro ao carregar matérias: ' + error.message);
            }
        }
        carregarMaterias();
    }, []);

    // Carrega turmas quando matéria é selecionada
    useEffect(() => {
        async function carregarTurmas() {
            if (selectedMateria) {
                try {
                    const res = await fetch(`http://localhost:3000/presencas/materia/${selectedMateria}/turmas`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setTurmas(data);
                } catch (error) {
                    setMensagem('Erro ao carregar turmas: ' + error.message);
                }
            }
        }
        carregarTurmas();
    }, [selectedMateria]);

    // Carrega alunos quando turma é selecionada
    const carregarAlunos = useCallback(async () => {
        if (selectedTurma || editando) {
            try {
                const res = await fetch('http://localhost:3000/alunos', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();

                // FILTRAR APENAS ALUNOS ATIVOS (status = 1)
                const alunosAtivos = data.filter(aluno => aluno.status === 2 || aluno.status === 1);

                // Mantém presenças existentes apenas para alunos ativos
                setPresencas(prevPresencas => {
                    const novasPresencas = { ...prevPresencas };

                    if (!editando) {
                        alunosAtivos.forEach(aluno => {
                            if (!(aluno.id in novasPresencas)) {
                                novasPresencas[aluno.id] = true;
                            }
                        });
                    } else {
                        alunosAtivos.forEach(aluno => {
                            if (!(aluno.id in novasPresencas)) {
                                novasPresencas[aluno.id] = false;
                            }
                        });
                    }
                    return novasPresencas;
                });

                setAlunos(alunosAtivos); // Seta apenas alunos ativos
            } catch (error) {
                setMensagem('Erro ao carregar alunos: ' + error.message);
            }
        }
    }, [selectedTurma, editando]);

    useEffect(() => {
        carregarAlunos();
    }, [carregarAlunos]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMateria || !selectedTurma) {
            setMensagem('Selecione uma matéria e uma turma');
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        try {
            const alunosPresentes = alunos.map(aluno => ({
                alunoId: aluno.id,
                presente: presencas[aluno.id] || false
            }));

            const url = editando
                ? `http://localhost:3000/presencas/${location.state.id}`
                : 'http://localhost:3000/presencas';

            const method = editando ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    materiaId: selectedMateria,
                    turmaId: selectedTurma,
                    alunos: alunosPresentes
                })
            });

            if (!response.ok) {
                throw new Error(editando
                    ? 'Erro ao atualizar presenças'
                    : 'Erro ao registrar presenças');
                setTimeout(() => setMensagem(""), 3000);
            }

            setMensagem(editando
                ? 'Presenças atualizadas com sucesso!'
                : 'Presenças registradas com sucesso!');

            setTimeout(() => navigate('/relatorioPresenca'), 2000);

        } catch (error) {
            setMensagem(error.message);
            setTimeout(() => setMensagem(""), 3000);
        }
    };

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <PaginaGeral>
                <Form onSubmit={handleSubmit} className="cadastroPresenca">
                    <div className="TituloP">
                        <strong> <h2>Presenças</h2>  </strong>
                    </div>

                    {mensagem && (
                        <div style={{ position: 'absolute', marginTop: '100px', marginLeft: '230px' }}>
                            <Alert className="alert-animado mt-2 mb-2" variant={
                                mensagem.toLowerCase().includes("sucesso") ? "success" :
                                    mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha") ? "danger" : "warning"
                            }>
                                {mensagem}
                            </Alert>
                        </div>
                    )}


                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formMateria" >
                                <Form.Label style={{ fontWeight: '500' }}>Oficina</Form.Label>
                                <Form.Select
                                    value={selectedMateria}
                                    onChange={(e) => !editando && setSelectedMateria(e.target.value)}
                                    disabled={editando}
                                    required
                                    className="inputPresenca"
                                >
                                    <option value="">Selecione uma oficina</option>
                                    {materias.map((materia) => (
                                        <option key={materia.id} value={materia.id}>
                                            {materia.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>


                        <Col md={6}>
                            <Form.Group controlId="formTurma">
                                <Form.Label style={{ fontWeight: '500' }}>Turma</Form.Label>
                                <Form.Select
                                    value={selectedTurma}
                                    onChange={(e) => !editando && setSelectedTurma(e.target.value)}
                                    disabled={editando}
                                    required
                                    className="inputPresenca"
                                >
                                    <option value="">Selecione uma turma</option>
                                    {turmas.map((turma) => (
                                        <option key={turma.id} value={turma.id}>
                                            {turma.cor} - {turma.periodo}
                                        </option>
                                    ))}
                                    {turmas.length === 0 && selectedMateria && (
                                        <option disabled>Nenhuma turma encontrada para esta matéria</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                    </Row>
                    {alunos.length > 0 && (
                        <>
                            <h4 className="mt-4 mb-3">Registro de Presenças</h4>
                            <Table striped bordered hover responsive style={{ width: '70%' }}>
                                <thead>
                                    <tr>
                                        <th>Aluno</th>
                                        <th>Presente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alunos.map((aluno) => (
                                        <tr key={aluno.id}>
                                            <td style={{ width: '25%' }}>{aluno.nome}</td>
                                            <td style={{ width: '1%' }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={presencas[aluno.id] || false}
                                                    onChange={(e) =>
                                                        setPresencas({
                                                            ...presencas,
                                                            [aluno.id]: e.target.checked,
                                                        })
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    <div className="d-flex justify-content-between mt-4 margintop">
                        <Button
                            as={Link}
                            to="/telaMenu"
                            className="botaoPre"
                            variant="danger"
                        >
                            <IoArrowBackCircle size={20} />  Voltar
                        </Button>

                        <Button
                            as={Link}
                            to="/relatorioPresenca"
                            className="botaoPre"
                            variant="primary"
                            style={{ backgroundColor: '#642ca9', borderColor: '#4f2f7fff' }}>
                            <TbReportSearch size={20} />  Relatórios
                        </Button>

                        <Button
                            type="submit"
                            className="botaoPre"
                            disabled={alunos.length === 0}
                            style={{ backgroundColor: '#ffba49', borderColor: '#e09722ff' }}
                        >
                            <BiSave size={20} />
                            {editando ? '  Atualizar' : '  Salvar'}
                        </Button>
                    </div>
                </Form>

            </PaginaGeral>
        </div>
    );
}