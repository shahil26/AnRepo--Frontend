/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaComment,
  FaTimesCircle,
  FaPlus,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import overviewService from "../../../services/overviewService";

const StatusTooltip = ({ status, onToggle, id }) => (
  <div className="group relative">
    <button
      onClick={() => onToggle(id, !status)}
      className="hover:opacity-80 transition-opacity"
    >
      {status ? (
        <FaCheckCircle className="text-green-500 text-xl" />
      ) : (
        <FaTimesCircle className="text-red-500 text-xl" />
      )}
    </button>
    <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
      Toggle
    </span>
  </div>
);

const AddModal = ({ isOpen, onClose, onSubmit, addData, setAddData }) => {
  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
        onClick={handleClickOutside}
      >
        <div
          ref={modalRef}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4">Add New Work</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={addData.title}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={addData.description}
                onChange={(e) =>
                  setAddData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 resize-none h-24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Assign To
              </label>
              <input
                type="text"
                value={addData.assignTo}
                onChange={(e) =>
                  setAddData((prev) => ({ ...prev, assignTo: e.target.value }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700"
                placeholder="Email address, comma separated"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

const WorkManager = () => {
  const [requests, setRequests] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [commentsPopup, setCommentsPopup] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addData, setAddData] = useState({
    title: "",
    description: "",
    assignTo: "",
  });

  const fetchWork = useCallback(async () => {
    try {
      setLoading(true);
      const requestsData = await overviewService.get_requests();
      const assignedData = await overviewService.get_assigned();
      setRequests(requestsData.data);
      setAssigned(assignedData.data);
    } catch (error) {
      console.error("Error fetching work:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await overviewService.delete_work(id);
      fetchWork();
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", addData.title);
      formData.append("description", addData.description);
      formData.append("assignTo", addData.assignTo);
      await overviewService.add_work(formData);
      setIsAddModalOpen(false);
      fetchWork();
    } catch (error) {
      console.error("Error adding work:", error);
    }
  };

  const addComment = async () => {
    try {
      const formData = new FormData();
      formData.append("task_id", commentsPopup);
      formData.append("comment", newComment);

      await overviewService.comment_add(formData);
      fetchWork();
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  const renderTasks = (tasks, type) => (
    <div className="space-y-2">
      {tasks.length > 0 &&
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:bg-gray-700 rounded-lg shadow"
          >
            <div className="flex items-center gap-4 dark:text-white">
              <StatusTooltip
                status={task.status}
                onToggle={async (id, newStatus) => {
                  try {
                    const formData = new FormData();
                    formData.append("task_id", id);
                    formData.append("status", newStatus);
                    await overviewService.status_change(formData);
                    await fetchWork();
                  } catch (error) {
                    console.error("Error updating status:", error);
                    await fetchWork();
                  }
                }}
                id={task.id}
              />
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500 dark:text-white">{task.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCommentsPopup(task.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaComment className="text-xl" />
              </button>
              {type === "requests" && (
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="text-xl" />
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="w-full h-[calc(100vh-7rem)] border-2 border-gray-400 shadow-xl rounded-md p-4 overflow-auto dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Work Manager
      </h2>

      <div className="flex justify-between items-center ">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="mb-4 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        >
          <option value="requests">Pending Requests</option>
          <option value="assigned">Assigned Work</option>
        </select>
        {activeTab === "requests" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mb-4 p-2 text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="text-xl" />
          </button>
        )}
      </div>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          renderTasks(activeTab === "requests" ? requests : assigned, activeTab)
        )}
      </div>
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        addData={addData}
        setAddData={setAddData}
      />
      {commentsPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold dark:text-white">Comments</h3>
              <button
                onClick={() => setCommentsPopup(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
              >
                <FaTimesCircle className="text-2xl" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {(activeTab === "requests"
                ? requests.find((item) => item.id === commentsPopup)?.comments
                : assigned.find((item) => item.id === commentsPopup)?.comments
              )?.map((comment, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md "
                >
                  <p className="font-semibold text-sm dark:text-white">{comment.user}</p>
                  <p className="text-sm dark:text-white">{comment.comment}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 resize-none h-10"
              />
              <button
                onClick={addComment}
                className="p-2 bg-blue-500 text-white rounded-full"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkManager;
