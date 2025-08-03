import { useState, useEffect } from "react"
import { fetchTasks } from "../services/taskService"
import type { Task } from "../types/task"

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  )
  const [search, setSearch] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const loadTasks = async () => {
      try {
        const data = await fetchTasks()
        setTasks(data.results)
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        })
      } catch (err) {
        setError("Erro ao carregar tarefas")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  const handleLoadMore = async () => {
    if (!pagination.next) return

    try {
      setLoading(true)
      const data = await fetchTasks(pagination.next)
      setTasks((prev) => [...prev, ...data.results])
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      })
    } catch (err) {
      setError("Erro ao carregar mais tarefas")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_data")
    window.location.href = "/login"
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading && tasks.length === 0) return <div>Carregando...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className=" text-white bg-[#10141E]">
      <div className="container px-5 md:max-w-[70dvw] 2xl:max-w-[50dvw] py-10 md:mx-auto">
        <div className="p-4">
          <div className="flex justify-between items-center pb-5">
            <h1 className="text-3xl font-bold mb-4">
              Minhas Tarefas ({pagination.count})
            </h1>
            {user && (
              <div className="flex gap-5 items-end">
                <div className="text-lg">
                  Olá,{" "}
                  {user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-[#364153] px-3 py-0.5 mt-2 rounded-full transition-all duration-150 hover:cursor-pointer hover:bg-[#262e3b]"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Pesquisar tarefa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 mb-4 bg-[#1e2533] text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#364153]"
          />

          <div className="space-y-3 mb-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border-1 border-[#364153] rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      className={`font-medium text-lg ${
                        task.complete ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      task.complete
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.complete ? "Concluída" : "Pendente"}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>
                    Criado por:{" "}
                    {task.user.username.charAt(0).toUpperCase() +
                      task.user.username.slice(1)}
                  </span>
                  <span>{new Date(task.create).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {pagination.next && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-[#364153] font-semibold text-white px-4 py-2 rounded transition-all duration-150 disabled:opacity-50 hover:cursor-pointer hover:bg-[#262e3b]"
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskPage
