import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import AlunosPage from './pages/AlunosPage';
import CursosPage from './pages/CursosPage';
import MatriculasPage from './pages/MatriculasPage';

const Home = () => <h1 style={{ textAlign: 'center' }}>Bem-vindo ao Sistema de Gestão Escolar</h1>;

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/alunos">Alunos</Link></li>
              <li><Link to="/cursos">Cursos</Link></li>
              <li><Link to="/matriculas">Matrículas</Link></li>
            </ul>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alunos" element={<AlunosPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/matriculas" element={<MatriculasPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;