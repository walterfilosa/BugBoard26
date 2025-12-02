import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import './App.css';
import NavbarUtente from "./NavbarUtente";
import SegnalaIssue from "./SegnalaIssue";
import HomePageUtente from "./HomePageUtente";
import Login from "./Login";
import Footer from "./Footer";
import ProfiloUtente from "./ProfiloUtente";

const LayoutConNavbar = () => {
    return (
        <>
            <NavbarUtente />
            <Outlet />
            <Footer />
        </>
    );
};


function App() {
  return (
    <div className="App">
        <Router>

            <Routes path>
                <Route path="/" element={<Login/>}/>

                <Route element={<LayoutConNavbar />}>
                    <Route path="/VisualizzaIssue" element={<HomePageUtente/>}/>
                    <Route path="/SegnalaIssue" element={<SegnalaIssue/>}/>
                    <Route path="/profilo" element={<ProfiloUtente/>}/>
                </Route>
            </Routes>
        </Router>
    </div>
  );
}

export default App;
