/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import reportService from "../../../../services/reportService";
import { useNavigate } from "react-router-dom";
import visualizationService from "../../../../services/visualizationService";
import VisCard from "../../dataComponents/VisCard";
import VisModal from "../../dataComponents/VisModal";

const FileSidebar = ({ images, visualizations, auto_create }) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visualizationsData, setVisualizationsData] = useState([]);
  const [visualizationLength, setVisualizationLength] = useState(0);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [selectedVis, setSelectedVis] = useState(null);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState({
    title: "",
    image: null,
    roles_access: [],
    file_type: "",
  });
  const handleSelect = (visItem) => {
    setSelectedVis(visItem);
    setIsModalOpen2(true);
};
const handleDeleteSuccess = () => {
    fetchVisualizations();
};
const handleClose = () => {
    setIsModalOpen2(false);
    setSelectedVis(null);
};
  const fetchVisualizations = useCallback(async () => {
    try {
      const result = await visualizationService.get_visualizations();
      result.visualizations = result.visualizations.filter(
        (data) => !data.is_deleted
      );
      setVisualizationsData(result.visualizations);
      setVisualizationLength(result.visualizations.length);
    } catch (error) {
      console.error("Error fetching visualizations:", error);
    }
  }, []);

  const availableSections = [
    images && "images",
    visualizations && "visualizations",
    auto_create && "auto_create",
  ].filter(Boolean);
  const listImages = useCallback(async () => {
    try {
      // Assuming images is an array or can be fetched
      const images = await reportService.listImages();
      if (images) {
        setImagesList(images);
      }
    } catch (error) {
      console.error("Error listing images:", error);
    }
  }, []);
  const roles = {
    admin: "Admin",
    dept_head: "Dept. Head",
    faculty: "Faculty",
    student: "Student",
    financial_officer: "Financial Officer",
    reviewer: "Report Reviewer",
    viewer: "Viewer",
};
const handleImageSubmit = async (e) => {
    e.preventDefault();
    console.log(modalData.title);

    try {
      const formData = new FormData();
      formData.append("file_name", modalData.title);
      formData.append("file", modalData.image);
      formData.append("file_type", modalData.file_type);
      formData.append("roles_access", JSON.stringify(modalData.roles_access));

      await reportService.uploadImage(formData);

      // Reset form and close modal
      setModalData({
        title: "",
        image: null,
        roles_access: [],
        file_type: "",
      });
      setIsModalOpen(false);

      // Refresh images list if needed
      if (selectedSection === "images") {
        listImages();
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };
  const handleSectionChange = async (e) => {
    const selected = e.target.value;
    setSelectedSection(selected);
    if (selected === "images") {
      const response = await listImages();
      console.log(response);
      if (response.status === 200) {
        setImagesList(response.data);
      }
    }
    if (selected === "visualizations") {
      fetchVisualizations();
    }
    if (selected === "auto_create") {
      console.log("Fetch auto create templates");
    }
  };
  const handleAdd = (section) => {
    switch (section) {
      case "images":
        if (section === "images") {
          setIsModalOpen(true);
        }

        break;
      case "visualizations":
        console.log("Add new visualization");
        navigate("/dashboard/visualization");
        break;
      case "auto_create":
        console.log("Add new auto create template");
        // Add auto create logic here
        break;
      default:
        console.log("Please select a section first");
    }
  };

  return (
    <>
      <div className="w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <select
              value={selectedSection}
              onChange={handleSectionChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Section</option>
              {availableSections.map((section) => (
                <option key={section} value={section}>
                  {section.charAt(0).toUpperCase() +
                    section.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FaPlus
              onClick={() => handleAdd(selectedSection)}
              className={`text-2xl cursor-pointer ${
                selectedSection
                  ? "text-blue-500 dark:text-blue-300"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            />
          </div>
        </div>
        <div className="flex mt-4 items-center justify-center">
          {selectedSection === "images" && images && (
            <div className="mb-6">
              {imagesList.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {imagesList.map((image) => (
                    <div
                      key={image.id}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No images found
                </div>
              )}
            </div>
          )}

          {selectedSection === "visualizations" && visualizations && (
            <div className="mb-6">
              <div className="overflow-y-auto mt-4 flex-1 h-[60vh]">
                {visualizationsData.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <h3 className="text-2xl laptop:text-4xl">
                      No visualizations found
                    </h3>
                  </div>
                ) : (
                  visualizationsData.map((visItem, index) => (
                    <VisCard
                      key={index}
                      data={{
                        ...visItem,
                        date_uploaded: visItem.date_uploaded.split("T")[0],
                      }}
                      onSelect={handleSelect}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {selectedSection === "auto_create" && auto_create && (
            <div className="mb-6"></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Add New Image
            </h2>

            <form onSubmit={handleImageSubmit}>
              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  value={modalData.title}
                  onChange={(e) =>
                    setModalData({ ...modalData, title: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setModalData({ ...modalData, image: e.target.files[0] })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* File Type Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  File Type
                </label>
                <select
                  value={modalData.file_type}
                  onChange={(e) =>
                    setModalData({ ...modalData, file_type: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Type</option>
                  <option value="Financial">Financial</option>
                  <option value="Trends">Trends</option>
                  <option value="Descriptive">Descriptive</option>
                  <option value="Achievements">Achievements</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Informative">Informative</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Roles Access
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(roles).map(([key, label]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`role-${key}`}
                        checked={modalData.roles_access.includes(key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setModalData({
                              ...modalData,
                              roles_access: [...modalData.roles_access, key],
                            });
                          } else {
                            setModalData({
                              ...modalData,
                              roles_access: modalData.roles_access.filter(
                                (role) => role !== key
                              ),
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`role-${key}`}
                        className="text-sm dark:text-white"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
          {isModalOpen2 && selectedVis && (
                <VisModal data={selectedVis} onClose={handleClose} onDeleteSuccess={handleDeleteSuccess} />
            )}
        </div>
      )}
    </>
  );
};

export default FileSidebar;
