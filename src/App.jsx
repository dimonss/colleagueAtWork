import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColleaguesList from './components/ColleaguesList';
import ColleagueDetail from './components/ColleagueDetail';
import ColleagueForm from './components/ColleagueForm';
import Login from './components/Login';
import { AuthProvider } from './context/AuthProvider';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ColleaguesList />} />
            <Route path="/colleague/:id" element={<ColleagueDetail />} />
            <Route path="/add" element={<ColleagueForm />} />
            <Route path="/edit/:id" element={<ColleagueForm />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
