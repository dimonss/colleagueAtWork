import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColleaguesList from './components/ColleaguesList';
import ColleagueDetail from './components/ColleagueDetail';
import ColleagueForm from './components/ColleagueForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ColleaguesList />} />
          <Route path="/colleague/:id" element={<ColleagueDetail />} />
          <Route path="/add" element={<ColleagueForm />} />
          <Route path="/edit/:id" element={<ColleagueForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
