import "./BulkUpload.css";
import NavBar from "../../NavBar/NavBar";
import SideBarNavigator from "../../NavBar/SideBarNavigator/SideBarNavigator";
import { useState } from "react";
import axios from "axios";  
import UpdateMeterReadingsModal from "../Modal/UpdateMeterReadingsModal.jsx/UpdateMeterReadingsModal";
import url from "../../../Url";
import { useSelector } from "react-redux";

const BulkUpload = () => {
  const token = useSelector(state=>state.accessToken);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddRecord = () => {
    setIsOpen(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;

    
    if (droppedFiles.length === 1) {
      const file = droppedFiles[0];

      if (file.name.endsWith(".csv")) {
        setFile(file);
        setFileName(file.name);
        setErrorMessage(""); 
        uploadFile(file); 
      } else {
        setErrorMessage("Please upload a .csv file.");
      }
    } else {
      setErrorMessage("Please upload only one file.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    
    if (selectedFile) {
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setErrorMessage("");
        uploadFile(selectedFile); 
      } else {
        setErrorMessage("Please upload a .csv file.");
      }
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${url}/fileupload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (res.status === 200) {
        setSuccessMessage(res.data.message); 
      }
    } catch (error) {
      setFile(null);
      setFileName(null);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Something went wrong");
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="admin">
        <SideBarNavigator />
        {isOpen && (
          <UpdateMeterReadingsModal
            props={{ setIsOpen,newRecord:true, reading: {}, newUserRecord: true }}
          />
        )}
        <div className="drag_drop">
          

          <div className="upload__header">
            <h3>Upload Meter Records CSV File</h3>
            <button onClick={handleAddRecord} title="Add Single Record">Add Meter Record</button>
          </div>

          <div
            className="dropZone"
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ border: "2px dashed #ccc", padding: "20px" }}
          >
            <h1>Drag And Drop CSV File</h1>
            <h1>Or</h1>

            <div className="input">
              {!fileName && (
                <input
                  type="file"
                  onChange={handleFileChange}
                />
              )}
            </div>

            {fileName && <p>Selected file: {fileName}</p>}

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
