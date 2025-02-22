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
        
            <div className="flex flex-col h-screen">
                {/* ✅ Navbar at the top */}
                <Navbar />

                {/* ✅ Sidebar below Navbar & Main Content next to it */}
                <div className="flex flex-1">
                    {/* Sidebar: Fixed Width */}
                    <Sidebar />
                    <main className="flex-1 p-6 overflow-auto">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/tasks" element={<Tasks />} />
                            <Route path="/team" element={<Teams />} />
                        </Routes>
                    </main>


                </div>
            </div>
        
    )
}

export default AppLayout