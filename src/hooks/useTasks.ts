import { useEffect, useState } from "react"
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService"
import type { Task } from "../types/task"

export function useTasks() {
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "complete" | "incomplete"
  >("all")
  const [dateFilter, setDateFilter] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, dateFilter])

  const getFilters = () => {
    const filters: Record<string, string> = {}
    if (search) filters.search = search
    if (statusFilter !== "all")
      filters.complete = statusFilter === "complete" ? "true" : "false"
    if (dateFilter) filters.date = dateFilter
    return filters
  }

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await fetchTasks("/tarefas/", getFilters())
      setTasks(data.results)
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      })
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar tarefas")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!pagination.next) return
    setLoading(true)
    try {
      const data = await fetchTasks(pagination.next)
      setTasks((prev) => [...prev, ...data.results])
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      })
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar mais tarefas")
    } finally {
      setLoading(false)
    }
  }

  const saveTask = async () => {
    if (!currentTask?.title?.trim()) return
    try {
      if (isEditing && currentTask.id) {
        const updated = await updateTask(currentTask.id, currentTask)
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      } else {
        const created = await createTask({
          title: currentTask!.title!,
          description: currentTask?.description || "",
          complete: false,
          user: user!,
        })
        setTasks((prev) => [created, ...prev])
        await loadTasks()
      }
      setShowModal(false)
    } catch (err) {
      console.error(err)
      setError("Erro ao salvar tarefa")
    }
  }

  const deleteOne = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setPagination((prev) => ({ ...prev, count: prev.count + 1 }))
      await loadTasks()
    } catch (err) {
      console.error(err)
      setError("Erro ao deletar tarefa")
    }
  }

  const toggleComplete = async (taskId: number, currentStatus: boolean) => {
    try {
      const updated = await updateTask(taskId, { complete: !currentStatus })
      setTasks((prev) =>
        [
          ...prev.map((task) =>
            task.id === taskId ? { ...task, complete: updated.complete } : task
          ),
        ].sort((a, b) => Number(a.complete) - Number(b.complete))
      )
      await loadTasks()
    } catch (err) {
      console.error(err)
      setError("Erro ao atualizar tarefa")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_data")
    window.location.href = "/login"
  }

  return {
    tasks,
    loading,
    error,
    user,
    pagination,
    showModal,
    isEditing,
    currentTask,
    search,
    statusFilter,
    dateFilter,

    setSearch,
    setStatusFilter,
    setDateFilter,
    setShowModal,
    setIsEditing,
    setCurrentTask,

    loadMore,
    saveTask,
    deleteOne,
    toggleComplete,
    logout,
  }
}
