import { useState, useEffect } from "react";
import { FaTrashAlt, FaUndo } from "react-icons/fa"; // Importing icons
import overviewService from "../../../services/overviewService";

const Trash = () => {
  const [selectedOption, setSelectedOption] = useState("Raw Data");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [trashData, setTrashData] = useState({
    work: [],
    annualReport: [],
    reportCards: [],
    visualisations: [],
    rawData: [],
    imageData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  // Add these functions inside component
const handleRestore = async (id) => {
  try {
    const formData = new FormData();
    formData.append('item_id', id);
    await overviewService.restore(formData);
    // Refresh trash data after restore
    fetchTrash();
  } catch (error) {
    console.error('Failed to restore item:', error);
  }
};

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to permanently delete this item?')) {
    try {
      const formData = new FormData();
      formData.append('item_id', id);
      await overviewService.bomb(formData);
      // Refresh trash data after deletion
      fetchTrash();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }
};
  // Add fetch function
  const fetchTrash = async () => {
    setTrashData({
      work: [],
      annualReport: [],
      reportCards: [],
      visualisations: [],
      rawData: [],
      imageData: [],
    });
    try {
      setIsLoading(true);
      const response = await overviewService.getTrash();
      response.data.files.forEach((file) => {
        switch(file.type) {
          case "data":
            setTrashData((prev) => ({
              ...prev,
              rawData: [...prev.rawData, file],
            }));
            break;
          case "work":
            setTrashData((prev) => ({
              ...prev,
              work: [...prev.work, file],
            }));
            break;
          case "annual_report":
            setTrashData((prev) => ({
              ...prev,
              annualReport: [...prev.annualReport, file],
            }));
            break;
          case "report_cards":
            setTrashData((prev) => ({
              ...prev,
              reportCards: [...prev.reportCards, file],
            }));
            break;
          case "visualisations":
            setTrashData((prev) => ({
              ...prev,
              visualisations: [...prev.visualisations, file],
            }));
            break;
          case "image":
            setTrashData((prev) => ({
              ...prev,
              imageData: [...prev.imageData, file],
            }));
            break
          default:
            console.warn(`Unknown file type: ${file.type}`);
        }
      });
      // Update trash data
    } catch (error) {
      console.error('Failed to fetch trash:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add useEffect
  useEffect(() => {
    fetchTrash();
  }, []);


  const rawData = trashData.rawData || [];
  const workData = trashData.work || [];
  const annualReportData = trashData.annualReport || [];
  const visualisationsData = trashData.visualisations || [];
  const reportCardsData = trashData.reportCards || [];
  const imageData = trashData.imageData || [];


  return (
    <div className="w-full h-[calc(100vh-7rem)] border-2 shadow-xl rounded-md p-4 overflow-auto dark:bg-gray-900 dark:border-gray-700 border-gray-400
    ">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Trash
      </h3>

      {/* Dropdown */}
    {isLoading ? (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <>
      <div className="mb-4">
        <select
          id="dropdown"
          value={selectedOption}
          onChange={handleSelectChange}
          className="mt-2 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Raw Data">Raw Data</option>
          <option value="Visualisations">Visualisations</option>
          <option value="Work">Work</option>
          <option value="Annual Report">Annual Report</option>
          <option value="Report Cards">Report Cards</option>
          <option value="Images">Images</option>
        </select>
      </div>

      {/* Display Raw Data */}
      {selectedOption === "Raw Data" && (
        <div className="space-y-4">
          {rawData.length>0 && rawData.map((data,index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {data.file_name}
                </h4>
                {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Deleted: {data.dateDeleted}
                </p> */}
              </div>
              <div className="flex space-x-2">
                {/* Restore Icon */}
                <button onClick={() => handleRestore(data.file_id)} className="text-green-500 hover:text-green-600">
                  <FaUndo size={20} />
                </button>
                {/* Delete Icon */}
                <button onClick={() => handleDelete(data.file_id)} className="text-red-500 hover:text-red-600">
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Image Data */}
      {selectedOption === "Images" && (
        <div className="space-y-4">
          {imageData.length>0 && imageData.map((data) => (
            <div
              key={data.id}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {data.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Deleted: {data.dateDeleted}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* Restore Icon */}
                <button onClick={() => handleRestore(data.id)} className="text-green-500 hover:text-green-600">
                  <FaUndo size={20} />
                </button>
                {/* Delete Icon */}
                <button onClick={() => handleDelete(data.id)} className="text-red-500 hover:text-red-600">
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Work Data */}
      {selectedOption === "Work" && (
        <div className="space-y-4">
          {workData.length>0 && workData.map((data) => (
            <div
              key={data.id}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {data.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Deleted: {data.dateDeleted}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* Restore Icon */}
                <button onClick={() => handleRestore(data.id)} className="text-green-500 hover:text-green-600">
                  <FaUndo size={20} />
                </button>
                {/* Delete Icon */}
                <button onClick={() => handleDelete(data.id)} className="text-red-500 hover:text-red-600">
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Annual Report Data */}
      {selectedOption === "Annual Report" && (
        <div className="space-y-4">
          {annualReportData.length>0 && annualReportData.map((data) => (
            <div
              key={data.id}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {data.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Deleted: {data.dateDeleted}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* Restore Icon */}
                <button onClick={() => handleRestore(data.id)} className="text-green-500 hover:text-green-600">
                  <FaUndo size={20} />
                </button>
                {/* Delete Icon */}
                <button onClick={() => handleDelete(data.id)} className="text-red-500 hover:text-red-600">
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Report Cards Data */}
      {selectedOption === "Report Cards" && (
        <div className="space-y-4">
          {reportCardsData.length>0 && reportCardsData.map((data) => (
            <div
              key={data.id}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {data.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Deleted: {data.dateDeleted}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* Restore Icon */}
                <button onClick={() => handleRestore(data.id)} className="text-green-500 hover:text-green-600">
                  <FaUndo size={20} />
                </button>
                {/* Delete Icon */}
                <button onClick={() => handleDelete(data.id)} className="text-red-500 hover:text-red-600">
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Visualisations Data */}
      {selectedOption === "Visualisations" && (
        <div className="space-y-4">
          {visualisationsData.length>0 && visualisationsData.map((data) => (
            <div
              key={data.id}
              className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {data.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date Deleted: {data.dateDeleted}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* Restore Icon */}
                <button onClick={() => handleRestore(data.id)} className="text-green-500 hover:text-green-600">
                  <FaUndo size={20} />
                </button>
                {/* Delete Icon */}
                <button onClick={() => handleDelete(data.id)} className="text-red-500 hover:text-red-600">
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      </>)}
    </div>
  );
};

export default Trash;