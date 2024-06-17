// pages/index.tsx

import { useState, useEffect } from 'react';

const Home = () => {
  const [tasks, setTasks] = useState<{ id: number; title: string; completed: boolean }[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskValue, setEditTaskValue] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US'));
      setCurrentDate(
          now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const addTask = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: inputValue.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const removeTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    if (editTaskId === taskId) {
      setEditTaskId(null);
      setEditTaskValue('');
    }
  };

  const toggleCompletion = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const startEditing = (taskId: number, taskTitle: string) => {
    setEditTaskId(taskId);
    setEditTaskValue(taskTitle);
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTaskValue('');
  };

  const saveEditedTask = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, title: editTaskValue } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
    setEditTaskValue('');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme as 'light' | 'dark');
    }
  }, []);

  return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-black' : 'bg-gray-100 text-black'}`}>
        <div className="max-w-screen-md w-full p-8 bg-white shadow-md rounded-lg dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-black">To-Do List by Houssam</h1>
          <p className="text-center text-gray-500 mb-4 dark:text-gray-400">{currentDate}</p>
          <p className="text-center text-gray-500 mb-4 dark:text-gray-400">Current Time: {currentTime}</p>
          <div className="flex mb-4">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter a task"
                className="p-4 mr-4 flex-1 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-700 dark:text-black dark:border-gray-600"
            />
            <button
                onClick={addTask}
                className="p-4 bg-blue-500 text-black rounded-md cursor-pointer hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
          <div className="mb-4 flex justify-center">
            <button
                className={`mx-2 p-2 ${filter === 'all' ? 'bg-blue-500 text-black' : 'bg-gray-300 text-gray-600'} rounded-md cursor-pointer hover:bg-blue-600 dark:bg-gray-700 dark:text-black`}
                onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
                className={`mx-2 p-2 ${filter === 'active' ? 'bg-blue-500 text-black' : 'bg-gray-300 text-gray-600'} rounded-md cursor-pointer hover:bg-blue-600 dark:bg-gray-700 dark:text-black`}
                onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
                className={`mx-2 p-2 ${filter === 'completed' ? 'bg-blue-500 text-black' : 'bg-gray-300 text-gray-600'} rounded-md cursor-pointer hover:bg-blue-600 dark:bg-gray-700 dark:text-black`}
                onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          <ul className="p-0">
            {filteredTasks.map((task) => (
                <li
                    key={task.id}
                    className={`bg-white shadow-md mb-4 rounded-md p-4 flex justify-between items-center dark:bg-gray-700 ${task.completed && 'opacity-50'}`}
                >
                  {editTaskId === task.id ? (
                      <input
                          type="text"
                          value={editTaskValue}
                          onChange={(e) => setEditTaskValue(e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-600 dark:text-black dark:border-gray-500"
                      />
                  ) : (
                      <span className="flex-1 dark:text-black">{task.title}</span>
                  )}
                  <div>
                    {editTaskId === task.id ? (
                        <>
                          <button
                              onClick={() => saveEditedTask(task.id)}
                              className="text-green-500 cursor-pointer hover:text-green-600"
                          >
                            Save
                          </button>
                          <button
                              onClick={cancelEditing}
                              className="ml-2 text-gray-500 cursor-pointer hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                    ) : (
                        <>
                          <button
                              onClick={() => startEditing(task.id, task.title)}
                              className="text-blue-500 cursor-pointer hover:text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                              onClick={() => toggleCompletion(task.id)}
                              className={`ml-2 text-green-500 cursor-pointer hover:text-green-600 ${task.completed && 'text-gray-400'}`}
                          >
                            {task.completed ? 'Completed' : 'Mark Complete'}
                          </button>
                          <button
                              onClick={() => removeTask(task.id)}
                              className="ml-2 text-red-500 cursor-pointer hover:text-red-600"
                          >
                            Remove
                          </button>
                        </>
                    )}
                  </div>
                </li>
            ))}
          </ul>
        </div>
        <button
            onClick={toggleTheme}
            className={`fixed bottom-4 right-4 p-3 bg-gray-300 text-gray-800 rounded-full ${theme === 'dark' ? 'hover:bg-gray-400' : 'hover:bg-gray-700'}`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
  );
};

export default Home;
