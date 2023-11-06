import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTasks } from '../slices/tasksSlice';
import Ticket from '../assets/ticket.svg';
import User from '../assets/user.svg';

const TaskList = () => {
  const tasks = useSelector(selectTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newComment, setNewComment] = useState('');

  const categories = ['All', ...new Set(tasks.map(task => task.category))];

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const addComment = () => {
    if (newComment.trim() !== '') {
      setSelectedTask((prevTask) => ({
        ...prevTask,
        comments: [...prevTask.comments, `user: ${newComment}`],
      }));
      setNewComment('');
    }
  };

  const renderComments = (comments) => {
    return (
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <div className='flex items-center'>
              <img
                src={User}
                alt="User Icon"
                className="w-5 h-5 mr-2 text-green-500"
              />
              {comment}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const filteredTasks = selectedCategory === 'All' ? tasks : tasks.filter(task => task.category === selectedCategory);

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
                className="cursor-pointer hover-bg-gray-100 p-2"
              >
                <div className='flex items-center'>
                  <img
                    src={Ticket}
                    alt="Ticket Icon"
                    className="w-5 h-5 mr-2 text-green-500"
                  />
                  <h3 className="text-lg font-medium">{task.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-2/3 p-4">
          {selectedTask ? (
            <div>
              <h3 className="text-2xl font-semibold mb-2">{selectedTask.title}</h3>
              <p className="mb-2"><strong>Requirements:</strong> {selectedTask.requirements}</p>
              <p className="mb-2"><strong>Description:</strong> {selectedTask.description}</p>
              {Array.isArray(selectedTask.comments) && selectedTask.comments.length > 0 ? (
                <div>
                  <p className="mb-2"><strong>Comments:</strong></p>
                  {renderComments(selectedTask.comments)}
                </div>
              ) : (
                <p className="italic text-gray-500">No comments for this task.</p>
              )}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add a Comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={addComment}
                className="bg-blue-500 text-white p-2 rounded hover-bg-blue-700"
              >
                Add Comment
              </button>
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
