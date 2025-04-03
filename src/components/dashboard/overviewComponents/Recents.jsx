import { useState, useEffect } from "react";
import overviewService from "../../../services/overviewService";
import { useNavigate } from "react-router";
import DataCard from "../dataComponents/DataCard";
import VisCard from "../dataComponents/VisCard";
import VisModal from "../dataComponents/VisModal";
import DataModal from "../dataComponents/DataModal";

const Recents = () => {
  const [recents, setRecents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisModalOpen, setIsVisModalOpen] = useState(false);
  const [selectedVis, setSelectedVis] = useState(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const navigate = useNavigate();
  const handleVisClose = () => {
    setIsVisModalOpen(false);
    setSelectedVis(null);
  };
  const handleDataClose = () => {
    setIsDataModalOpen(false);
    setSelectedData(null); 
  };
  const fetchRecents = async () => {
    try {
      setIsLoading(true);
      const data = await overviewService.get_recents();
      console.log(data.data.recents);
      setRecents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch recents:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDataDeleteSuccess = () => {
    fetchRecents(); // Re-fetch data on successful upload
  };
  useEffect(() => {
    fetchRecents();
  }, []);

  const handleVisDeleteSuccess = () => {
    setIsVisModalOpen(false);
    setSelectedVis(null);
    fetchRecents();
  };
  const handleDataSelect = (dataItem) => {
    setSelectedData(dataItem); // Set the selected data
    setIsDataModalOpen(true); // Open the modal
  };
  const handleVisSelect = (visItem) => {
    setSelectedVis(visItem);
    setIsVisModalOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-7rem)] border-2 shadow-xl rounded-md p-4 overflow-auto  dark:bg-gray-900 dark:border-gray-700 border-gray-400">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Recents
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : recents.length > 0 ? (
        <div className="space-y-4">
          {recents.map((item, index) =>
            item.type === "data" ? (
              <DataCard
                key={index}
                data={{
                  ...item,
                  date_uploaded: item.date_uploaded.split("T")[0],
                }}
                onSelect={handleDataSelect}
              />
            ) : item.type === "visualization" ? (
              <VisCard
                key={index}
                data={{
                  ...item,
                  date_uploaded: item.date_uploaded.split("T")[0],
                }}
                onSelect={handleVisSelect}
              />
            ) : item.type === "report" ? (
              <div
                key={index}
                onClick={() => navigate("/dashboard/report")}
              ></div>
            ) : item.type === "reportcard" ? (
              <div
                key={index}
                onClick={() => navigate("/dashboard/reportcard")}
              ></div>
            ) : null
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No recent items found
        </div>
      )}
      {isVisModalOpen && selectedVis && (
        <VisModal
          data={selectedVis}
          onClose={handleVisClose}
          onDeleteSuccess={handleVisDeleteSuccess}
        />
      )}
      {isDataModalOpen && selectedData && (
        <DataModal
          data={selectedData}
          onClose={handleDataClose}
          onDeleteSuccess={handleDataDeleteSuccess}
        /> 
      )}
    </div>
  );
};

export default Recents;
