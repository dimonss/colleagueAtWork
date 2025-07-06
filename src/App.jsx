import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColleaguesList from './components/ColleaguesList';
import ColleagueDetail from './components/ColleagueDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ColleaguesList />} />
          <Route path="/colleague/:id" element={<ColleagueDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
