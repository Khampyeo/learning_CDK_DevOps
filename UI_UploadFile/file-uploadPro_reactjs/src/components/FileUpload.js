import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CiFileOn } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { MdDownloading } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [stateFiles, setStateFiles] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
    },
  });

  useEffect(() => {
    setStateFiles(new Array(uploadedFiles.length).fill(null));
  }, [uploadedFiles]);

  const [fileUploadedSuccessfully, setFileUploadedSuccessfully] = useState("");

  const onFileUpload = async () => {
    if (uploadedFiles.length < 1) return null;
    setFileUploadedSuccessfully("");
    const arr = new Array(uploadedFiles.length).fill("pending");
    setStateFiles(arr);
    setLoadingBtn(true);
    try {
      Promise.all(
        uploadedFiles.map(async (file, key) => {
          await putFileToS3(file, file).catch(async (err) => {
            await putFileToS3(file, file).catch(async (err) => {
              await putFileToS3(file, file).catch(async (err) => {
                console.log(err);
              });
            });
          });

          const newArr = new Array(uploadedFiles.length).fill(null);

          arr[key] = "success";

          arr.forEach((item, key) => {
            newArr[key] = arr[key];
          });

          setStateFiles(newArr);
        })
      ).then(() => {
        setLoadingBtn(false);
        setUploadedFiles([]);
        setFileUploadedSuccessfully("true");
        return;
      });
    } catch (error) {
      console.log(error);
      setLoadingBtn(false);
      setUploadedFiles([]);
      setFileUploadedSuccessfully("false");
      return;
    }
  };
  console.log(process.env.FILE_API);
  const putFileToS3 = async (file, formData) => {
    const contentType = file.type || "application/octet-stream";
    let urlToPut =
      "https://b15orz69r9.execute-api.ap-southeast-1.amazonaws.com/prod/file";

    if (process.env.FILE_API) {
      urlToPut = process.env.FILE_API + "/file";
    }
    const response = await axios.post(urlToPut, {
      fileName: file.name,
      contentType: contentType,
    });
    const url = response.data.url;
    console.log(contentType, file);
    return await await axios.put(url, formData, {
      headers: {
        "Content-Type": contentType,
      },
    });
  };

  const deleteItem = (name) => {
    const newUploadedFiles = uploadedFiles.filter((file) => file.name !== name);
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
          {uploadedFiles.map((file, key) => (
            <li
              className="p-2 bg-green-200 mt-2 rounded-lg flex items-center"
              key={file.name}
            >
              <CiFileOn className="text-[32px] shrink-0 mr-1" />
              <p className="text-[14px]">{file.name}</p>
              <RxCross2
                onClick={() => deleteItem(file.name)}
                className={`${
                  stateFiles[key] === null ? "block " : "hidden"
                } text-[24px] shrink-0 ml-auto cursor-pointer transition-all hover:text-red-700`}
              />
              <MdDownloading
                className={`${
                  stateFiles[key] === "pending" ? "block" : "hidden"
                } text-[24px] text-green-700 animate-spin shrink-0 ml-auto`}
              />
              <FaCheck
                className={`${
                  stateFiles[key] === "success" ? "block" : "hidden"
                } text-[22px] text-green-700 shrink-0 ml-auto`}
              />
            </li>
          ))}
        </ul>
        <div
          onClick={() => {
            if (loadingBtn === false) onFileUpload();
          }}
          className={`${
            loadingBtn === true
              ? "cursor-default opacity-50 "
              : "hover:bg-green-700"
          }
            mt-4 bg-green-600 rounded-lg py-2 text-white cursor-pointer font-medium text-[18px] transition-all `}
        >
          Upload
        </div>
        <div
          className={`${
            fileUploadedSuccessfully === "true" ? "flex" : "hidden"
          } mt-4 justify-center items-center`}
        >
          <FaRegCircleCheck className="text-green-800 mr-2 text-[20px]" />
          <p className={`font-semibold text-green-800 `}>
            file Uploaded Successfully!
          </p>
        </div>
        <div
          className={`${
            fileUploadedSuccessfully === "false" ? "flex" : "hidden"
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
