import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import Search from "./Search";
import { IoReload } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";

export default function ListFiles(props) {
  const [files, setFiles] = useState([]);
  const [loadFiles, setLoadFiles] = useState(true);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoadFiles(true);
    const getAllFiles = async () => {
      const response = await axios.get(
        "https://f8i0f9vx5i.execute-api.ap-southeast-1.amazonaws.com/prod/files"
      );
      setFiles(response.data.items);
    };
    getAllFiles();
    setTimeout(() => {
      setLoadFiles(false);
    }, 500);
  }, [props.select, reload]);

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

      var link = document.createElement("a");
      link.href = url;
      link.download = url.substr(url.lastIndexOf("/") + 1);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteItem = async (key) => {
    try {
      await axios.delete(
        "https://f8i0f9vx5i.execute-api.ap-southeast-1.amazonaws.com/prod/file",
        {
          data: {
            key: key,
          },
        }
      );
      const newFiles = files.filter((file) => file.key !== key);
      setFiles(newFiles);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex bg-white rounded-lg relative">
        <Search setSearch={setSearch} />
        <div
          onClick={() => {
            setReload(!reload);
          }}
          className="inline-block absolute p-2 right-4 top-[50%] -translate-y-[50%] border border-[#4d4d4d] rounded-full hover:bg-slate-200 cursor-pointer transition-all"
        >
          <TfiReload />
        </div>
      </div>
      <div className="bg-white py-4 px-4 rounded-lg mt-4 ">
        {loadFiles !== true ? (
          <ul className={` grid grid-cols-1 gap-3`}>
            <p className={`${files.length >= 1 ? "hidden" : "block"}`}>
              No Item In The Bucket!
            </p>
            {files.map(
              (file) =>
                file.name.toLowerCase().includes(search.toLowerCase()) && (
                  <li
                    className="p-2 bg-green-200 rounded-lg flex items-center"
                    key={file.name}
                  >
                    <CiFileOn className="text-[32px] shrink-0 mr-1" />
                    <p
                      className="text-[14px]"
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {file.name}
                    </p>
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
                )
            )}
          </ul>
        ) : (
          <div className="justify-center flex items-center">
            <IoReload className="text-center animate-spin text-black text-[24px]" />
          </div>
        )}
      </div>
    </div>
  );
}
