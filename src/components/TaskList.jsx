import React, { useState, useEffect, useRef } from 'react';
import Ticket from '../assets/ticket.svg';
import User from '../assets/user.svg';
import Menu from '../assets/menu.svg';
import { useDispatch, useSelector } from 'react-redux';
import {updateTask, deleteTask,fetchDataByCategory, fetchTaskData, setSelectedTask } from '../slices/ticketSlices';
import {fetchCategoryNames} from '../slices/categorySlice';

const TaskList = () => {
  const [newComment, setNewComment] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [editedAcceptanceCriteria, setEditedAcceptanceCriteria] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(0);

  const handleFetchTaskClick = (task) => {
    dispatch(setSelectedTask(task));
    setIsDropdownOpen(false);
    setIsEditing(false);
  };

  const nextPageHandle = () => {
    setPageNumber((prevPage) => prevPage + 1);
    fetchTaskData()
  };

  const prevPageHandle = () => {
    if (pageNumber > 0) {
      setPageNumber((prevPage) => prevPage - 1);
    }
  };

  const dispatch = useDispatch();
  const { data,  selectedTask, error } = useSelector((state) => state.ticket);

  useEffect(() => {
    selectedCategory != "All" ?  dispatch(fetchDataByCategory({selectedCategory})):
       dispatch(fetchTaskData({ search, pageNumber }));
  }, [dispatch, search, pageNumber]);

  const { allCategories } = useSelector((state) => state.category);
  console.log(allCategories);


  useEffect(() => {
    dispatch(fetchCategoryNames());
  }, []);

  useEffect(() => {
    fetchTaskData(pageNumber);
  }, [pageNumber]);

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
                className="w-5 h-5 mr-2 text-green-500"/>
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
 let  category = null
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
      acceptanceCriteria: editedAcceptanceCriteria,
      description: editedDescription,
    };
    setIsEditing(false)
    dispatch(updateTask({ id: selectedTask.ticketId, updatedTask }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(selectedTask.ticketId));
    dispatch(setSelectedTask(null))
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

  useEffect(() => {
    dispatch(fetchDataByCategory(selectedCategory));
  }, [selectedCategory]);


  return (
    <div className="mb-4">
    <h3 className="text-lg font-medium mb-2 ml-3">Filter by Category</h3>
    <div className='flex gap-8'>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="p-2 border rounded ml-3">
      <option value="All">All Categories</option>
      {allCategories &&
      allCategories.map((name, index) => (
        <option key={index} value={name.name}>
          {name.name}
        </option>
      ))}
    </select>
    <input
        type="text"
        id="searchInput"
        placeholder="Enter your search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"/>
      <button
        onClick={fetchTaskData}
        className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
        Search
      </button>
    </div>
      <div className="flex">
        <div className="w-1/3 p-4">
          <ul className="border-r border-gray-300 pr-4">
          {
  
    <div className='relative'>
      <h2>Task List:</h2>
      <ul>
        {!error ? (
          data && data.map((task, index) => (
            <li
              key={index}
              onClick={() => handleFetchTaskClick(task)}
              className={`cursor-pointer p-2 ${
                selectedTask === task ? 'bg-gray-100' : ''
              } mb-4 rounded-lg transition duration-300 hover:bg-gray-200`}>
              <div className="flex items-center">
                <img
                  src={Ticket}
                  alt="Ticket Icon"
                  className="w-5 h-5 mr-2 text-green-500"/>
                <h3 className="text-lg font-medium">{task.title}</h3>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>
      
    </div>
  }<div className='flex gap-8 font-bold fixed left-12 bottom-32'>
  <button onClick={prevPageHandle}>Prev</button>
  -
  <button onClick={nextPageHandle}>Next</button>
</div>
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
                    onClick={toggleDropdown}/>
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg p-2 shadow-md">
                      <button
                        onClick={startEditing}
                        className="text-blue-500 underline block mb-2 cursor-pointer">
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
                      className="w-full p-2 border rounded"/>
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
      <h3>CATEGORY: {allCategories &&
        (category = allCategories.find(category => category.categoryId === selectedTask.categoryId))
          ? category.name
          : 'Unknown'
      }</h3>
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
                  className="w-full p-2 border rounded"/>
              </div>
              <button
                onClick={addComment}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
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
