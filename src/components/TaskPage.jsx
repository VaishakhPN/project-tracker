import React from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const TaskPage = () => {
  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <TaskList />
      </div>
      <div className="w-1/2 p-4">
        <TaskForm />
      </div>
    </div>
  );
};

export default TaskPage;
