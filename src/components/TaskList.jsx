import React, { useState, useEffect, useRef } from 'react';
import Ticket from '../assets/ticket.svg';
import User from '../assets/user.svg';
import Menu from '../assets/menu.svg';
import axios from 'axios';

const TaskList = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [taskData, setTaskData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allCat, setAllCat] = useState(null)

  const handleFetchTaskClick = (task) => {
    setSelectedTask(task);
    setIsDropdownOpen(false);
  };

  const getCategoryNames = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/view');
      const uniqueNames = [...new Set(response.data.map(category => category.name).filter(name => name !== null))];
      setAllCat(uniqueNames)
    } catch (error) {
      console.error('Error fetching category names:', error);
      return [];
    }
  };

  const fetchTaskData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tickets/view');
      setTaskData(response.data);
    } catch (error) {
      console.error('Error fetching task data:', error);
    }
  };

  useEffect(() => {
    fetchTaskData();
    getCategoryNames();

  }, []);

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
          <li key={index} className="mb-2">
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = () => {
    const newRequirements = prompt('Edit Requirements:', selectedTask.requirements);
    const newDescription = prompt('Edit Description:', selectedTask.description);
  
    if (newRequirements !== null || newDescription !== null) {
      const updatedTask = {
        ...selectedTask,
        requirements: newRequirements || selectedTask.requirements, 
        description: newDescription || selectedTask.description, 
      };
  
      axios.put(`http://localhost:8080/tickets/${selectedTask.id}`, updatedTask)
        .then((response) => {
          console.log('Task updated successfully');
          setSelectedTask(updatedTask);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/tickets/${id}`)
      .then((response) => {
        console.log('Task deleted successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const filteredTasks = taskData ? (
    selectedCategory === 'All' ? taskData : taskData.filter(task => task.category === selectedCategory)
  ) : [];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Task List</h2>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Filter by Category</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Categories</option>
          {allCat !== null &&
          allCat.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex">
        <div className="w-1/3 p-4">
          <ul className="border-r border-gray-300 pr-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => handleFetchTaskClick(task)}
                  className={`cursor-pointer p-2 ${
                    selectedTask === task ? 'bg-gray-100' : ''
                  } mb-4 rounded-lg transition duration-300 hover:bg-gray-200`}
                >
                  <div className="flex items-center">
                    <img
                      src={Ticket}
                      alt="Ticket Icon"
                      className="w-5 h-5 mr-2 text-green-500"
                    />
                    <h3 className="text-lg font-medium">{task.title}</h3>
                  </div>
                </li>
              ))
            ) : (
              <p>No tasks available.</p>
            )}
          </ul>
        </div>

        <div className="w-2/3 p-4">
          {selectedTask ? (
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold mb-4">{selectedTask.title}</h3>
                <div className="relative" ref={dropdownRef}>
                  <img
                    src={Menu}
                    alt="Menu Icon"
                    className="w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={toggleDropdown}
                  />
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg p-2 shadow-md">
                      <button
                        onClick={handleEdit}
                        className="text-blue-500 underline block mb-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedTask.id)}
                        className="text-red-500 underline block cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mb-4"><strong>Requirements:</strong> {selectedTask.requirements}</p>
              <p className="mb-4"><strong>Description:</strong> {selectedTask.description}</p>
              {Array.isArray(selectedTask.comments) && selectedTask.comments.length > 0 ? (
                <div>
                  <p className="mb-4"><strong>Comments:</strong></p>
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
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
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