import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [category, setCategory] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(addTask({ title, description, acceptanceCriteria, category }));
    setTitle('');
    setDescription('');
    setAcceptanceCriteria('');
    setCategory('');
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <textarea
        placeholder="Acceptance Criteria"
        value={acceptanceCriteria}
        onChange={e => setAcceptanceCriteria(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <button onClick={handleSubmit}>Create Task</button>
    </div>
  );
};

export default TaskForm;

