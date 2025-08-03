import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import TaskPage from "./pages/TaskPage"
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tarefas" element={<TaskPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
