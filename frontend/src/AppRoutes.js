// AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLogin } from './LoginContext';
import TelaMenu from './componentes/Telas/TelaMenu';
import TelaLogin from './componentes/Telas/TelaLogin';
import FormCadTurma from './componentes/Telas/Formularios/FormCadTurma';
import FormCadEscola from './componentes/Telas/Formularios/FormCadEscola';
import RelatorioTurmas from './componentes/Telas/Relatorios/RelatorioTurmas';
import RelatorioEscolas from './componentes/Telas/Relatorios/RelatorioEscolas';
import FormCadAluno from './componentes/Telas/Formularios/FormCadaluno/FormCadAluno';
import FormCadmateria from './componentes/Telas/Formularios/FromCadMateria';
import RelatorioMateria from './componentes/Telas/Relatorios/RelatorioMaterias';
import RelatorioResponsaveis from './componentes/Telas/Relatorios/RelatorioResponsaveis';
import FormCadResponsavel from './componentes/Telas/Formularios/FormCadResponsavel';
import FormCadEvento from './componentes/Telas/Formularios/FormCadEvento/FormCadEvento';
import RelatorioEventos from './componentes/Telas/Relatorios/RelatorioEventos';
import RelatorioAlunos from './componentes/Telas/Relatorios/RelatorioAluno/RelatorioAlunos';
import FormCadHorario from './componentes/Telas/Formularios/FormCadHorario';
import RelatorioHorario from './componentes/Telas/Relatorios/RelatorioHorario';
import TelaDadosUsuario from './componentes/Telas/TelaDadosUsuario';
import TelaVerificarEmail from './componentes/Telas/TelaVerificarEmail';
import TelaEmailSenha from './componentes/Telas/TelaEmailSenha';
import TelaAlterarSenha from './componentes/Telas/TelaAlterarSenha';
import RelatorioFuncionarios from './componentes/Telas/Relatorios/RelatorioFuncionarios';
import FormCadFuncionario from './componentes/Telas/Formularios/FormCadFuncionario';
import RelatorioListaEspera from './componentes/Telas/Relatorios/RelatorioListaEspera';
import FormCadListaEspera from './componentes/Telas/Formularios/FormCadListaEspera';
import TelaRecuperarSenha from './componentes/Telas/TelaRecuperarSenha';
import TelaRVerificarCodigo from './componentes/Telas/TelaVerificarCodigo';
import { Alert, Spinner } from 'react-bootstrap';
import PrivateRoute from './PrivateRoutes';
import FormCadPresenca from './componentes/Telas/Formularios/FormCadPresenca';
import RelatorioPresenca from './componentes/Telas/Relatorios/RelatorioPresencas';
import FormCadFamilia from './componentes/Telas/Formularios/FormCadFamilia';
import RelatorioFamilia from './componentes/Telas/Relatorios/RelatorioFamilia';
import RelatorioFaltas from './componentes/Telas/Relatorios/RelatorioFaltas';
import MatriculaPage from './componentes/Telas/Formularios/FormCadaluno/MatriculaPage';
function AppRoutes() {
    const { isLogado, loading } = useLogin();

    if (loading) {
        // Pode ser qualquer componente de carregamento, ou null
        return <Alert variant="info" className="d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <Spinner animation="border" role="status" className="me-2">
            <span className="visually-hidden">Carregando...</span>
            </Spinner>
            Carregando...
        </Alert>;
    }

    return (
        <Routes>
            <Route path="/" element={isLogado ? <Navigate to="/telaMenu" /> : <TelaLogin />} />
            <Route path="/verificarEmail" element={<TelaVerificarEmail/>}/>
            <Route path="/redefinirSenha" element={<TelaRecuperarSenha/>}/>
            <Route path="/verificarCodigo" element={<TelaRVerificarCodigo/>}/>
            {isLogado && (
                <>
                    <Route path="/telaMenu" element={<TelaMenu />} />
                    <Route path="/dadosUsuario" element={<TelaDadosUsuario/>}/>
                    <Route path="/telaEmailSenha" element={<TelaEmailSenha/>}/>
                    <Route path="/alterarSenha" element={<TelaAlterarSenha/>}/>
                        <Route path="/cadastroTurma" element={<FormCadTurma />} />
                        <Route path="/relatorioTurma" element={<RelatorioTurmas />} />
                        <Route path="/cadastroMateria" element={<FormCadmateria/>} />
                        <Route path="/relatorioMateria" element={<RelatorioMateria />} />
                        <Route path="/cadastroHorario" element={<FormCadHorario/>}/>
                        <Route path="/relatorioHorario" element={<RelatorioHorario/>}/>
                        <Route path="/relatorioEvento" element={<RelatorioEventos />}/>
                        <Route path="/cadastroEvento" element={<FormCadEvento />}/>
                    <Route element={<PrivateRoute niveisPermitidos={[1, 2, 3, 6]}/>}>
                        
                        <Route path="/cadastroPresenca" element={<FormCadPresenca/>}/>
                        <Route path="/relatorioPresenca" element={<RelatorioPresenca/>}/>
                        <Route path="/relatorioFalta" element={<RelatorioFaltas />} />
                    </Route>
                    <Route element={<PrivateRoute niveisPermitidos={[1, 4, 2]}/>}>
                        <Route path="/cadastroAluno" element={<FormCadAluno />} />
                        <Route path="/relatorioAluno" element={<RelatorioAlunos />} />
                        <Route path="/matricula" element={<MatriculaPage />} />
                    </Route>

                    <Route element={<PrivateRoute niveisPermitidos={[1, 3, 2]}/>}>
                        <Route path="/cadastroFamilia" element={<FormCadFamilia/>}/>
                        <Route path="/relatorioFamilia" element={<RelatorioFamilia/>}/>
                    </Route>

                    <Route element={<PrivateRoute niveisPermitidos={[2, 5, 3, 1]}/>}>
                        <Route path="/cadastroFuncionario" element={<FormCadFuncionario />} />
                        <Route path="/relatorioFuncionario" element={<RelatorioFuncionarios />} />
                        <Route path="/relatorioListaEspera" element={<RelatorioListaEspera />} />
                        <Route path="/cadastroListaEspera" element={<FormCadListaEspera />} />
                    </Route>
                    <Route element={<PrivateRoute niveisPermitidos={[1, 2]}/>}>
                        <Route path="/cadastroResponsavel" element={<FormCadResponsavel />} />
                        <Route path="/relatorioResponsavel" element={<RelatorioResponsaveis/>}/>   
                        <Route path="/cadastroEscola" element={<FormCadEscola />} />
                        <Route path="/relatorioEscola" element={<RelatorioEscolas />} />
                    </Route>
                </>
            )}
            {!isLogado && (
                <Route path="*" element={<Navigate to="/" />} />
            )}
        </Routes>
    );
}

export default AppRoutes;
