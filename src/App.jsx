import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tasks from "./pages/tasks";
import Dashboard from "./pages/dashboard";
function App() {
  console.log('render app..')
  return (
    <AppLayout>
      <ToastContainer
        position="top-right"
        gutter={8}
        autoClose = {3000}
      />
      <Routes>
        <Route path="/projects/:id" element={<Tasks />} />
        <Route path="/projects/:id/tasks" element={<Tasks />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  );
}

export default App;