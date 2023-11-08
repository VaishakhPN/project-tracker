import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice';
import axios from 'axios';

const TaskForm = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const dispatch = useDispatch();

  const postCategory = async (name) => {
    try {
      const newCategoryData = { name };
      const response = await axios.post('http://localhost:8080/category/create', newCategoryData);
      console.log('post response 1',response.data);
      return response.data;
    } catch (error) {
      console.log('An error occurred while creating a new category.');
    }
  };

  const postTicket = async (categoryId) => {
    try {
      const newTaskData = { categoryId, title, requirements, description, comments};
      const response = await axios.post('http://localhost:8080/tickets/create', newTaskData);
      console.log('post response 2',response);
      return response.data;
    } catch (error) {
      console.log('An error occurred while creating a new task.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!category || !title) {
      alert('Category and Title are required fields.');
      return;
    }

    try {
      const categoryResponse = await postCategory(category);

      if (categoryResponse) {
        const taskResponse = await postTicket(categoryResponse.categoryId);

        dispatch(addTask(taskResponse));

        setCategory('');
        setTitle('');
        setRequirements('');
        setDescription('');
        setComments('');
      }
    } catch (error) {
      console.log('An error occurred while creating a new category or task.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create a New Task</h2>
      <form onSubmit={handleSubmit}>
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
        {/* <div className="mb-4">
          <textarea
            placeholder="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div> */}
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
