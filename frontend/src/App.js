import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import './App.css';
import NavbarUtente from "./NavbarUtente";
import NavbarAmministratore from './NavbarAmministratore';
import SegnalaIssue from "./SegnalaIssue";
import HomePageUtente from "./HomePageUtente";
import Login from "./Login";
import Footer from "./Footer";
import ProfiloUtente from "./ProfiloUtente";
import {DettaglioIssue} from "./DettaglioIssue";
import HomePageAmministratore from "./HomePageAmministratore";

const LayoutUtente = () => {
    return (
        <>
            <NavbarUtente />
            <Outlet />
            <Footer />
        </>
    );
};

const LayoutAdmin = () => {
    return (
        <>
            <NavbarAmministratore/> {}
            <Outlet/>
            <Footer/>
        </>
    );
}

    function App() {
        return (
            <div className="App">
                <Router>

                    <Routes path>
                        <Route path="/" element={<Login/>}/>

                        <Route element={<LayoutUtente/>}>
                            <Route path="/visualizza-issue" element={<HomePageUtente/>}/>
                            <Route path="/dettaglio-issue/:id" element={<DettaglioIssue/>}/>
                            <Route path="/segnala-issue" element={<SegnalaIssue/>}/>
                            <Route path="/profilo" element={<ProfiloUtente/>}/>
                        </Route>

                        <Route element={<LayoutAdmin/>}>
                            <Route path="/admin/segnala-issue" element={<SegnalaIssue/>}/>
                            <Route path="/gestisci-issue" element={<HomePageAmministratore/>}/>
                            <Route path="/admin/dettaglio-issue/:id" element={<DettaglioIssue/>}/>
                            <Route path="/admin/profilo" element={<ProfiloUtente/>}/>
                        </Route>
                    </Routes>
                </Router>
            </div>
        );
    }

    export default App;
