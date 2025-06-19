
const API_URL = "http://129.213.153.123:8000/tasks"; 

export const fetchTasks = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const createTask = async (task) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await res.json();
};

export const updateTask = async (id, updates) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

