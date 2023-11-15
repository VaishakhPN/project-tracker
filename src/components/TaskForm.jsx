import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice';
import axios from 'axios';

const TaskForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category/view');
        setCategories(response.data);
      } catch (error) {
        console.log('An error occurred while fetching categories.');
      }
    };

    fetchCategories();
  }, []);

  const postTicket = async () => {
    try {
      const newTaskData = {
        "category":{categoryId: selectedCategory},
        title,
        acceptanceCriteria,
        description,
        comments,
      };
      const response = await axios.post('http://localhost:8080/tickets/create', newTaskData);
      console.log(newTaskData)
      console.log('post response 2', response);
      return response.data;
    } catch (error) {
      console.log('An error occurred while creating a new task.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCategory || !title) {
      alert('Category and Title are required fields.');
      return;
    }

    try {
      const taskResponse = await postTicket();

      dispatch(addTask(taskResponse));

      setSelectedCategory('');
      setTitle('');
      setAcceptanceCriteria('');
      setDescription('');
      setComments('');
    } catch (error) {
      console.log('An error occurred while creating a new task.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category) => (
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
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Acceptance Criteria"
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
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
