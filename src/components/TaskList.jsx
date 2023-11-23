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
  const [allCategories, setAllCategories] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAcceptanceCriteria, setEditedAcceptanceCriteria] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState('');
  

  const handleFetchTaskClick = (task) => {
    console.log('Selected task:', task);
    setSelectedTask(task);
    setIsDropdownOpen(false);
    setIsEditing(false);
  };

  const performSearch = async () => {
    axios.get(`http://localhost:8080/tickets/search?query=${search}`)
      .then(response => {
        console.log('Search Results:', response.data);
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  const getCategoryNames = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/view');
      const uniqueNames = [...new Set(response.data.map(category => category.name).filter(name => name !== null))];
      setAllCategories(uniqueNames);
    } catch (error) {
      console.error('Error fetching category names:', error);
      return [];
    }
  };

  const fetchTaskData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tickets/view');
      console.log('Task data from backend:', response.data);
      setTaskData(response.data);
      setData(response.data)

      if (response.data.length > 0) {
        setSelectedTask(response.data[0]);
      }
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
      setSelectedTask((prevTask) => {
        const commentsArray = Array.isArray(prevTask.comments) ? prevTask.comments : [];
  
        return {
          ...prevTask,
          comments: [...commentsArray, `user: ${newComment}`],
        };
      });
  
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

  const startEditing = () => {
    setIsEditing(true);
    setIsDropdownOpen(false);

    setEditedAcceptanceCriteria(selectedTask.acceptanceCriteria);
    setEditedDescription(selectedTask.description);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdits = () => {

    const updatedTask = {
      ...selectedTask,
 category: {
      categoryId: selectedTask.categoryId
    },      acceptanceCriteria: editedAcceptanceCriteria,
      description: editedDescription,
    };
    console.log(updatedTask)

    axios
      .put(`http://localhost:8080/tickets/${selectedTask.ticketId}`, updatedTask)
      .then((response) => {
        console.log('Task updated successfully', response);
        setSelectedTask(updatedTask);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const handleDelete = (id) => {
    console.log(id)
    axios
      .delete(`http://localhost:8080/tickets/${id}`)
      .then(() => {
        console.log('Task deleted successfully ${id}');
        setTaskData((prevData) => prevData.filter((task) => task.id !== id));
        setSelectedTask(null);
        fetchTaskData();
        setIsDropdownOpen(false);

      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
      // window.location.reload();
      
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

  const [data, setData] = useState([]);
  
  const fetchData = async (category) => {
    try {
      let response;
      if (category === "All") {
        response = await axios.get(`http://localhost:8080/tickets/view`);
      } else {
        response = await axios.get(`http://localhost:8080/tickets/categories/name/${category}`);
      }
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="mb-4">
    <h3 className="text-lg font-medium mb-2">Filter by Category</h3>
    <div className='flex gap-8'>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="All">All Categories</option>
      {allCategories !== null &&
      allCategories.map((name, index) => (
        <option key={index} value={name}>
          {name}
        </option>
      ))}
    </select>
    <input
        type="text"
        id="searchInput"
        placeholder="Enter your search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={performSearch}
        className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
      >
        Search
      </button>
    </div>
      <div className="flex">
        <div className="w-1/3 p-4">
          <ul className="border-r border-gray-300 pr-4">
          {
  searchResults.length > 0 ? (
    <div>
      <h2>Search Results:</h2>
      <ul>
        {searchResults.map((task, index) => (
          <li
            key={index}
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
        ))}
      </ul>
    </div>
  ) : (
    <div>
      <h2>Task List:</h2>
      <ul>
        {data.length > 0 ? (
          data.map((task, index) => (
            <li
              key={index}
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
  )}
          </ul>
        </div>
        <div className="w-2/3 p-4">
          {selectedTask ? (
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold mb-4">TITLE: {selectedTask.title}</h3>
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
                        onClick={startEditing}
                        className="text-blue-500 underline block mb-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedTask.ticketId)}
                        className="text-red-500 underline block cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <div>
                  <label>
                  <h3>CATEGORY: {selectedTask.categoryName}</h3>
                <br />
                  AcceptanceCriteria:
                    <input
                      type="text"
                      value={editedAcceptanceCriteria}
                      onChange={(e) => setEditedAcceptanceCriteria(e.target.value)}
                      placeholder="Enter Acceptance Criteria"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                  <br />
                  <label>
                    Description:
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="Enter Description"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                  <br />
                  <div className='flex gap-4 p-2'>
                    <div className='font-bold'>
                      <button onClick={saveEdits}>Save</button>
                    </div>
                    <div className='font-bold'>
                      <button onClick={cancelEditing}>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>CATEGORY: {selectedTask.categoryName}</h3>
                  <br />
                  <p className="mb-4"><strong>Acceptance Criteria:</strong> {selectedTask.acceptanceCriteria}</p>
                  <p className="mb-4"><strong>Description:</strong> {selectedTask.description}</p>
                </div>
              )}
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