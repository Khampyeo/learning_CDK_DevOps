import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoFileTrayFullSharp } from "react-icons/io5";

export default function NavBar(props) {
  const { select, setSelect } = props;

  const clickFunction = (id) => {
    if (id === 2) setSelect(2);
    else setSelect(1);
  };
  return (
    <div className="p-2 bg-white w-full rounded-lg shadow-lg">
      <ul className="flex items-center text-[12px] text-[#b3b9c4] justify-around">
        <li
          onClick={() => {
            clickFunction(1);
          }}
          className={`${
            select === 1 && "text-green-700"
          } px-4 py-1 rounded-lg flex justify-between items-center flex-col w-[45%] cursor-pointer`}
        >
          <FaCloudUploadAlt className="text-[28px] mb-1" />
          <p className="font-bold">Upload</p>
        </li>
        <li
          onClick={() => {
            clickFunction(2);
          }}
          className={`${
            select === 2 && "text-green-700"
          } px-4 py-1 rounded-lg flex justify-between items-center flex-col w-[45%] cursor-pointer`}
        >
          <IoFileTrayFullSharp className="text-[28px] mb-1" />
          <p className="font-bold">Files</p>
        </li>
      </ul>
    </div>
  );
}
