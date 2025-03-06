import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Tasks from "./pages/tasks";
import Dashboard from "./pages/dashboard";
function App() {
  console.log('render app..')
  return (
    <AppLayout>
      <Toaster
        position="top-right"
        gutter={8}
      />
      <Routes>
        <Route path="/projects/:id" element={<Tasks />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
