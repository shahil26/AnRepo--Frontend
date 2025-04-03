import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import tokenUtils from "../utils/tokenUtils";

const AutoCreate = ({ editorInstance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    console.log(prompt);
    const token = tokenUtils.getToken();

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `http://64.227.158.253/report/create?custom_query=${prompt}`,
        {}, // Empty body if required
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

     // console.log(response);

      const reportData = response.data.report; // Assuming response.data contains the report content

     

      // Combine reportData with existing content in the editor
      if (editorInstance) {
        const currentData = editorInstance.getData(); // Get current editor content
        const combinedData = `${currentData}${reportData}`; // Combine content
        editorInstance.setData(combinedData); // Update the editor with combined content
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false); // Stop loading
      handleClose(); // Close the modal
      setPrompt(""); // Reset prompt after submission
    }
  };

  return (
    <div className="fixed bottom-4 left-8">
      {/* Chatbot Trigger Button */}
      <button
        onClick={handleOpen}
        className="rounded-full h-16 w-16 bg-blue-500 hover:bg-blue-600 shadow-lg text-white flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>

      {/* Prompt Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Create Your Annual Report
            </h2>

            <div className="mb-4">
              <textarea
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading} // Disable input while loading
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                disabled={loading} // Disable button while loading
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Loading..." : "Submit"} {/* Show loading text */}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="loader rounded-full border-4 border-blue-500 border-t-transparent h-12 w-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AutoCreate;
