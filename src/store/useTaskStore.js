import { create } from "zustand";
import * as api from "../api/tasks";

const useTaskStore = create((set) => ({
  tasks: [],
  filter: "all", 
  setFilter: (filter) => set({ filter }),
  fetchTasks: async () => {
    const data = await api.fetchTasks();
    set({ tasks: data });
  },
  addTask: async (task) => {
    const newTask = await api.createTask(task);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  updateTask: async (id, updates) => {
    await api.updateTask(id, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  deleteTask: async (id) => {
    await api.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
}));

export default useTaskStore;