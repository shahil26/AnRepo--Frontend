import React, { useState } from "react";
import FileSidebar from "./common/FileSidebar";
import img1 from "../../../assets/a1.png";
import img2 from "../../../assets/a2.jpeg";
import img3 from "../../../assets/a3.png";
import img4 from "../../../assets/a4.png";
import { Button } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import { IoIosAddCircleOutline } from "react-icons/io";

const ReportUpdate = () => {
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });
  const [value, setValue] = useState();
  const [sidebarImages, setSidebarImages] = useState([
    { id: 1, src: img1 },
    { id: 2, src: img2 },
    { id: 3, src: img3 },
    { id: 4, src: img4 },
  ]);
  const [gridImages, setGridImages] = useState({});

  const handleGridSizeChange = (rows, cols) => {
    setGridDimensions({ rows, cols });
  };

  const onDragStart = (e, imageId) => {
    e.dataTransfer.setData("imageId", imageId);
  };

  const onDrop = (e, cellId) => {
    const imageId = e.dataTransfer.getData("imageId");
    const draggedImage = sidebarImages.find((img) => img.id === parseInt(imageId));

    if (draggedImage) {
      // Remove image from sidebar
      setSidebarImages(sidebarImages.filter((img) => img.id !== parseInt(imageId)));

      // Add image to grid cell
      setGridImages({ ...gridImages, [cellId]: draggedImage });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const renderGridCells = (value) => {
    const cells = [];
    let bgClass = "";

    if (value === "2x4") bgClass = "h-[200px] w-[300px]";
    else if (value === "3x1") bgClass = "h-[200px] w-[70vw]";
    else if (value === "3x3") bgClass = "h-[200px] w-[400px]";
    else if (value === "3x2") bgClass = "h-[200px] w-[600px]";

    for (let i = 0; i < gridDimensions.rows; i++) {
      for (let j = 0; j < gridDimensions.cols; j++) {
        const cellId = `${i}-${j}`;
        cells.push(
          <div
            key={cellId}
            className={`relative border border-gray-300 rounded-lg m-1 flex justify-center items-center ${bgClass}`}
            onDrop={(e) => onDrop(e, cellId)}
            onDragOver={onDragOver}
          >
            {/* Cross icon for removing image */}
            {gridImages[cellId] && (
              <RxCross2
                className="absolute top-1 right-1 text-black rounded-full p-1 cursor-pointer shadow-md text-2xl"
                onClick={() => {
                  // Remove image from grid
                  const updatedGridImages = { ...gridImages };
                  delete updatedGridImages[cellId];
                  setGridImages(updatedGridImages);

                  // Optionally, add the removed image back to the sidebar
                  setSidebarImages([...sidebarImages, gridImages[cellId]]);
                }}
              />
            )}

            {/* Grid cell content */}
            {gridImages[cellId] ? (
              <img
                src={gridImages[cellId].src}
                alt={`grid-${cellId}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center items-center">
                <IoIosAddCircleOutline className="text-4xl text-center text-red-300" />
                <div className="text-center">Add Image</div>
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[255px] border-r border-b border-gray-400 flex-col justify-center items-center mb-4 rounded-lg">
          <div className="flex flex-col gap-8 mt-12 mb-4">
            {sidebarImages.map((img) => (
              <img
                key={img.id}
                src={img.src}
                className="border border-gray-300 rounded-lg mx-2 shadow-lg shadow-gray-500 cursor-pointer"
                draggable
                onDragStart={(e) => onDragStart(e, img.id)}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <div className="flex mt-6 justify-around pb-4">
            <h2 className="text-4xl font">Report Card</h2>
            <div className="flex gap-8 justify-end">
              <Button
                color="blue"
                className="shadow-lg shadow-blue-300"
                onClick={() => {
                  handleGridSizeChange(2, 4);
                  setValue("2x4");
                }}
              >
                2 x 4
              </Button>
              <Button
                color="red"
                className="shadow-lg shadow-red-300"
                onClick={() => {
                  handleGridSizeChange(3, 1);
                  setValue("3x1");
                }}
              >
                3 x 1
              </Button>
              <Button
                color="green"
                className="shadow-lg shadow-green-300"
                onClick={() => {
                  handleGridSizeChange(3, 3);
                  setValue("3x3");
                }}
              >
                3 x 3
              </Button>
              <Button
                color="amber"
                className="shadow-lg shadow-yellow-300"
                onClick={() => {
                  handleGridSizeChange(3, 2);
                  setValue("3x2");
                }}
              >
                3 x 2
              </Button>
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className="flex justify-center mt-6">
            {gridDimensions.rows > 0 && gridDimensions.cols > 0 && (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
                }}
              >
                {renderGridCells(value)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ReportCardInside = () => {
  return (
    <>
      <FileSidebar images visualizations />
      <ReportUpdate />
    </>
  );
};

export default ReportCardInside;
