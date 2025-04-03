import React, { useState, useEffect } from "react";
import axios from "axios";
import tokenUtils from "../utils/tokenUtils";

const ChartDisplay = () => {
  const [chartHTMLList, setChartHTMLList] = useState([]); // Stores list of visualizations
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error state

  useEffect(() => {
    const fetchChart = async () => {
      try {
        // Fetch token from utility
        const token = tokenUtils.getToken();

        // API call to fetch visualizations
        const response = await axios.get(
          "http://64.227.158.253/vis/list_visualizations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map and sanitize visualizations
        const chartData = response.data.visualizations.map((vis) => {
          let htmlTemplate = vis.html_template;

          // Update image paths to include base URL
          htmlTemplate = htmlTemplate.replace(
            /src="\/(.*?)"/g,
            'src="http://64.227.158.253/data/upload/$1"'
          );

          return htmlTemplate;
        });

        // Update state with visualizations
        setChartHTMLList(chartData);
        setIsLoading(false);
      } catch (err) {
        // Handle errors
        console.error("Error fetching charts:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchChart();
  }, []);

  // Loading state
  if (isLoading) {
    return <div className="text-center p-4">Loading charts...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading charts: {error}
      </div>
    );
  }

  // Render charts
  return (
    <div className="chart-wrapper w-full max-w-[80vw] mx-auto">
      {chartHTMLList.map((chartHTML, index) => (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: chartHTML }}
          className="chart-container bg-white p-4 shadow-md rounded-lg mb-4"
        />
      ))}
    </div>
  );
};

export default ChartDisplay;