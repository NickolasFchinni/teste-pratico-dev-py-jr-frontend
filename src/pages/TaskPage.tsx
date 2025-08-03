import { useTasks } from "../hooks/useTasks"
import type { Task } from "../types/task"

const TaskPage = () => {
  const {
    tasks,
    loading,
    error,
    user,
    pagination,
    showModal,
    isEditing,
    currentTask,
    setSearch,
    setStatusFilter,
    setDateFilter,
    setShowModal,
    setIsEditing,
    setCurrentTask,
    saveTask,
    deleteOne,
    toggleComplete,
    logout,
    loadMore,
    search,
    statusFilter,
    dateFilter,
  } = useTasks()

  const openCreateModal = () => {
    setIsEditing(false)
    setCurrentTask({ title: "", description: "", complete: false })
    setShowModal(true)
  }

  const openEditModal = (task: Task) => {
    setIsEditing(true)
    setCurrentTask(task)
    setShowModal(true)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "complete"
        ? task.complete
        : !task.complete

    const matchesDate = dateFilter
      ? new Date(task.create).toISOString().slice(0, 10) === dateFilter
      : true

    return matchesSearch && matchesStatus && matchesDate
  })

  if (loading && tasks.length === 0) return <div>Carregando...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className=" text-white bg-[#10141E]">
      <div className="container px-5 md:max-w-[70dvw] 2xl:max-w-[50dvw] py-10 md:mx-auto">
        <div className="p-4">
          <div className="flex justify-between items-center pb-5">
            <h1 className="text-3xl font-bold mb-4">Minhas Tarefas</h1>
            {user && (
              <div className="flex gap-5 items-end">
                <div className="text-lg">
                  Olá,{" "}
                  {user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}
                </div>
                <button
                  onClick={logout}
                  className="text-sm bg-[#364153] px-3 py-0.5 mt-2 rounded-full transition-all duration-150 hover:cursor-pointer hover:bg-[#262e3b]"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
          {showModal && (
            <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#1e2533] p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">
                  {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
                </h2>

                <input
                  type="text"
                  placeholder="Título"
                  value={currentTask?.title || ""}
                  onChange={(e) =>
                    setCurrentTask((prev) => ({
                      ...prev!,
                      title: e.target.value,
                    }))
                  }
                  className="w-full mb-3 px-3 py-2 bg-[#10141E] text-white rounded"
                />
                <textarea
                  placeholder="Descrição"
                  value={currentTask?.description || ""}
                  onChange={(e) =>
                    setCurrentTask((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  className="w-full mb-3 px-3 py-2 bg-[#10141E] text-white rounded"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveTask}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                  >
                    {isEditing ? "Salvar" : "Criar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Pesquisar tarefa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-[#1e2533] text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#364153]"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "complete" | "incomplete"
                )
              }
              className="px-3 py-2 bg-[#1e2533] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#364153]"
            >
              <option value="all">Todas</option>
              <option value="incomplete">Pendentes</option>
              <option value="complete">Concluídas</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-[#1e2533] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#364153]"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="bg-green-600 px-4 py-2 rounded mb-4 hover:bg-green-500"
          >
            Nova Tarefa
          </button>
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
                  <div className="flex flex-col items-end">
                    <span
                      onClick={() =>
                        toggleComplete(task.id, task.complete)
                      }
                      className={`px-2 py-1 text-xs rounded hover:cursor-pointer ${
                        task.complete
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.complete ? "Concluída" : "Pendente"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-sm text-blue-400 hover:underline ml-4 mt-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteOne(task.id)}
                        className="text-sm text-red-400 hover:underline ml-4 mt-2"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
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
              onClick={loadMore}
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
