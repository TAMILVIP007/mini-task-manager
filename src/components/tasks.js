import React, { useEffect, useState } from "react";
import { CheckCircle, Circle, Edit3, Trash2, Filter, Plus } from "lucide-react";
import useTaskStore from "../store/useTaskStore";
import "../App.css";

function Tasks() {
  const {
    tasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    filter,
    setFilter,
  } = useTaskStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const task = { title, description, completed: false };
    if (editId) {
      await updateTask(editId, task);
      setEditId(null);
    } else {
      await addTask(task);
    }
    setTitle("");
    setDescription("");
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">
            <div className="header-icon">
              <CheckCircle size={24} />
            </div>
            Task Manager
          </h1>
          <p className="header-subtitle">Stay organized and get things done</p>
        </div>
      </div>

      <div className="main-content">
        <div className="stats-card">
          <div className="stats-content">
            <div>
              <h2 className="stats-title">Your Progress</h2>
              <p className="stats-subtitle">Keep up the great work!</p>
            </div>
            <div className="stats-numbers">
              <div className="stats-count">{completedCount}/{totalCount}</div>
              <p className="stats-label">Tasks completed</p>
            </div>
          </div>
          {totalCount > 0 && (
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="form-card">
          <h2 className="form-title">
            <Plus size={20} />
            {editId ? "Edit Task" : "Add New Task"}
          </h2>
          
          <form onSubmit={handleSubmit} className="task-form">
            <div>
              <input
                type="text"
                placeholder="Task title (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="form-textarea"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editId ? "Update Task" : "Add Task"}
              </button>
              {editId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setDescription("");
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="filter-section">
          <div className="filter-label">
            <Filter size={16} />
            <span>Filter:</span>
          </div>
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} 
              {f === 'all' && totalCount > 0 && ` (${totalCount})`}
              {f === 'completed' && completedCount > 0 && ` (${completedCount})`}
              {f === 'pending' && (totalCount - completedCount) > 0 && ` (${totalCount - completedCount})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CheckCircle size={64} />
            </div>
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-subtitle">
              {filter === 'all' ? 'Add your first task to get started!' : `No ${filter} tasks at the moment.`}
            </p>
          </div>
        ) : (
          <div className="task-list">
            {filtered.map((task, index) => (
              <div
                key={task.id}
                className="task-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="task-content">
                  <div className="task-main">
                    <button
                      onClick={() => updateTask(task.id, { completed: !task.completed })}
                      className="checkbox-btn"
                    >
                      {task.completed ? (
                        <CheckCircle size={24} className="checkbox-checked" />
                      ) : (
                        <Circle size={24} className="checkbox-unchecked" />
                      )}
                    </button>
                    
                    <div className="task-text">
                      <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`task-description ${task.completed ? 'completed' : ''}`}>
                          {task.description}
                        </p>
                      )}
                      <p className="task-date">
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn-edit"
                    >
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;