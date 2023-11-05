import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice';

const TaskForm = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(addTask({ title, description, acceptanceCriteria, category }));
    setTitle('');
    setDescription('');
    setAcceptanceCriteria('');
    setCategory('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create a New Task</h2>
      <form>
      <div className="mb-4">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
