import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import NavbarUtente from "./NavbarUtente";
import SegnalaIssue from "./SegnalaIssue";
import HomePageUtente from "./HomePageUtente";


function App() {
  return (
    <div className="App">
        <Router>
            <NavbarUtente></NavbarUtente>
            <Routes path>
                <Route path="/VisualizzaIssue" element={<HomePageUtente/>}/>
                <Route path="/SegnalaIssue" element={<SegnalaIssue/>}/>
            </Routes>
        </Router>
    </div>
  );
}

export default App;
