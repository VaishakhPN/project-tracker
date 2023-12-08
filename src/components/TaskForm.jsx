import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, createTask } from '../slices/createSlice';
import { fetchCategoryNames } from '../slices/categorySlice';

const TaskForm = () => {
  const categories = useSelector((state) => state.category.allCategories);
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    dispatch(fetchCategoryNames());
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedCategory || !title) {
      alert('Category and Title are required fields.');
      return;
    }

    const newTaskData = {
      categoryId: selectedCategory,
      title,
      acceptanceCriteria,
      description,
      comments,
    };

    dispatch(createTask(newTaskData));

    setSelectedCategory('');
    setTitle('');
    setAcceptanceCriteria('');
    setDescription('');
    setComments('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 rounded border"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories&& categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Acceptance Criteria"
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
            className="w-full p-2 rounded border"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded border"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover-bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;