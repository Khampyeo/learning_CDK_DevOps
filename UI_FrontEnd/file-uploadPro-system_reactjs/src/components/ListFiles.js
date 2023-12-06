import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function ListFiles() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const getAllFiles = async () => {
      const response = await axios.get(
        "https://f8i0f9vx5i.execute-api.ap-southeast-1.amazonaws.com/prod/files"
      );
      setFiles(response.data.items);
    };
    getAllFiles();
  }, []);

  const downloadItem = async (key) => {
    try {
      const response = await axios.get(
        "https://f8i0f9vx5i.execute-api.ap-southeast-1.amazonaws.com/prod/file",
        {
          params: {
            key: key,
          },
        }
      );
      const url = response.data.url;
      console.log(url);
      window.open(url);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteItem = async (key) => {
    try {
      const response = await axios.delete(
        "https://f8i0f9vx5i.execute-api.ap-southeast-1.amazonaws.com/prod/file",
        {
          data: {
            key: key,
          },
        }
      );
      const newFiles = files.filter((file) => file.key != key);
      setFiles(newFiles);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white py-2 px-4 rounded-lg">
      <ul>
        <p className={`${files.length > 1 ? "hidden" : "block"}`}>
          No Item In The Bucket!
        </p>
        {files.map((file) => (
          <li
            className="p-2 bg-green-200 mt-2 rounded-lg flex items-center"
            key={file.name}
          >
            <CiFileOn className="text-[32px] shrink-0 mr-1" />
            <p className="text-[14px]">{file.name}</p>
            <div className="flex ml-auto items-center">
              <FaDownload
                onClick={() => downloadItem(file.key)}
                className="text-[30px] shrink-0 cursor-pointer transition-all text-[#82858a] hover:text-green-700 p-1 mr-2"
              />
              <MdOutlineDelete
                onClick={() => deleteItem(file.key)}
                className="text-[30px] shrink-0 cursor-pointer transition-all text-[#82858a] hover:text-red-700 p-1"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
