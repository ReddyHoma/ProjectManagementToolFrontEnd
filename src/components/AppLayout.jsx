import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Dashboard from "../pages/dashboard.jsx";
import Projects from "../pages/projects.jsx";
import Tasks from "../pages/tasks.jsx";
import Teams from "../pages/teams.jsx";

const AppLayout = () => {

    return (
        <div className="d-flex flex-column vh-100">
            <Navbar />
            <div className="container d-flex mx-auto w-100" style={{ height: 'calc(100vh - 56px)' }}>
                <Sidebar />
                <main className="flex-grow-1 p-3 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/projects/:id" element={<Tasks />} />
                        <Route path="/members" element={<Teams />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default AppLayout