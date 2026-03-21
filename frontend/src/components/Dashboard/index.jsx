import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import './index.css'

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const fetchTasks = async () => {
        const token = Cookies.get("jwt_token");
        const options = {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
        };
        const response = await fetch("https://primetrade-ai-8z46.onrender.com/api/v1/tasks", options);
        if (response.ok) {
            const data = await response.json();
            setTasks(data);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        const token = Cookies.get("jwt_token");
        const options = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ title, description }),
        };
        await fetch("https://primetrade-ai-8z46.onrender.com/api/v1/tasks", options);
        setTitle("");
        setDescription("");
        fetchTasks();
    };

    useEffect(() => { fetchTasks(); }, []);

    const deleteTasks = async (id) =>{
        const token = Cookies.get("jwt_token");
        const options = {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
        }
        await fetch(`https://primetrade-ai-8z46.onrender.com/api/v1/tasks/${id}`, options);
        fetchTasks()
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>User Dashboard</h1>
            <form onSubmit={addTask}>
                <input value={title} className="task" onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" required />
                <input value={description} className="task" onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <button className="task tasks-btn" type="submit">Add Task</button>
            </form>
            <ul className="dashboard-unordered-list">
                {tasks.map(task => (
                    <li className="tasks-item" key={task.id}>
                        <h3 className="tasks-hd">{task.title}</h3>
                        <p className="tasks-para">{task.description}</p>
                        <button className="tasks-btn" type="button" onClick={()=>{deleteTasks(task.id)}}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
