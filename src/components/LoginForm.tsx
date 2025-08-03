import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import type { LoginData } from "../types/auth"
import type { AuthResponse } from "../types/auth"

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post<AuthResponse>(
        "/api-token-auth/",
        formData
      )
      localStorage.setItem("token", response.data.token)
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          id: response.data.user_id,
          username: response.data.username,
        })
      )
      navigate("/tarefas")
    } catch (err) {
      setError("Credenciais inválidas")
      setTimeout(() => setError(""), 3000)
      console.log("Mais informações sobre o erro: " + err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 text-white w-[20rem]"
    >
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Usuário"
        className="bg-[#1D202A] border-1 px-5 py-2 border-[#364153] rounded-2xl text-white"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Senha"
        className="bg-[#1D202A] border-1 px-5 py-2 border-[#364153] text-white rounded-2xl"
      />
      {error && <p className="error text-center text-red-400">{error}</p>}
      <button
        type="submit"
        className="bg-[#364153] px-5 py-2 border-[#364153] text-white rounded-2xl mt-3 font-semibold"
      >
        Login
      </button>
    </form>
  )
}

export default LoginForm
