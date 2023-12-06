import axios from "axios";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CiFileOn } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
    },
  });
  const [fileUploadedSuccessfully, setFileUploadedSuccessfully] = useState("");

  const onFileUpload = async () => {
    if (uploadedFiles.length < 1) return null;
    try {
      Promise.all(
        uploadedFiles.map(async (file) => {
          console.log(file);
          const contentType = file.type || "application/octet-stream";
          const formData = new FormData();
          formData.append("file", file, file.name);
          const response = await axios.post(
            "https://f8i0f9vx5i.execute-api.ap-southeast-1.amazonaws.com/prod/file",
            { fileName: file.name }
          );
          const url = response.data.url;
          await axios.put(url, formData, {
            headers: { "Content-Type": contentType },
          });
        })
      ).then(() => {
        setUploadedFiles([]);
        setFileUploadedSuccessfully("true");
        return;
      });
    } catch (error) {
      console.log(error);
      setUploadedFiles([]);
      setFileUploadedSuccessfully("false");
      return;
    }
  };
  const deleteItem = (name) => {
    const newUploadedFiles = uploadedFiles.filter((file) => file.name != name);
    setUploadedFiles(newUploadedFiles);
  };
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <div
        className="border-dashed border-[4px] border-spacing-0 border-green-200 rounded-lg py-[20px]"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p className="font-medium text-[16px] p-2">
          Drag and drop files here or click to browse.
        </p>
      </div>
      <div>
        <ul>
          {uploadedFiles.map((file) => (
            <li
              className="p-2 bg-green-200 mt-2 rounded-lg flex items-center"
              key={file.name}
            >
              <CiFileOn className="text-[32px] shrink-0 mr-1" />
              <p className="text-[14px]">{file.name}</p>
              <RxCross2
                onClick={() => deleteItem(file.name)}
                className="text-[24px] shrink-0 ml-auto cursor-pointer transition-all hover:text-red-700"
              />
            </li>
          ))}
        </ul>
        <div
          onClick={onFileUpload}
          className="mt-4 bg-green-600 rounded-lg py-2 text-white cursor-pointer font-medium text-[18px] transition-all hover:bg-green-700"
        >
          Upload
        </div>
        <div
          className={`${
            fileUploadedSuccessfully == "true" ? "flex" : "hidden"
          } mt-4 justify-center items-center`}
        >
          <FaRegCircleCheck className="text-green-800 mr-2 text-[20px]" />
          <p className={`font-semibold text-green-800 `}>
            file Uploaded Successfully!
          </p>
        </div>
        <div
          className={`${
            fileUploadedSuccessfully == "false" ? "flex" : "hidden"
          } mt-4 justify-center items-center`}
        >
          <TiDelete className="text-red-800 mr-2 text-[20px]" />
          <p className={`font-semibold text-red-800 `}>file Uploaded Failed!</p>
        </div>
      </div>
    </div>
  );
};
export default FileUpload;
