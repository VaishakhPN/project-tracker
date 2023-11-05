import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTasks } from '../slices/tasksSlice';

const TaskList = () => {
  const tasks = useSelector(selectTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(tasks.map(task => task.category))];

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Task List</h2>

      <div className="flex">
        <div className="w-1/3">
          <div className="mb-4">
            <label htmlFor="category" className="block font-medium">Filter by Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="p-2 border rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <ul className="border-r border-gray-300 pr-4">
            {filteredTasks.map(task => (
              <li
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                <h3 className="text-lg font-medium">{task.title}</h3>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-2/3 p-4">
          {selectedTask ? (
            <div>
              <h3 className="text-2xl font-semibold mb-2">{selectedTask.title}</h3>
              <p className="mb-2"><strong>Description:</strong> {selectedTask.description}</p>
              <p className="mb-2"><strong>Acceptance Criteria:</strong> {selectedTask.acceptanceCriteria}</p>
              <p className="mb-2"><strong>Category:</strong> {selectedTask.category}</p>
            </div>
          ) : (
            <p className="italic text-gray-500">Select a task to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
