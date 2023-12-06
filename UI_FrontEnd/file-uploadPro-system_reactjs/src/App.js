import React, { useRef, useState } from "react";
import axios from "axios";

import "./App.css";
import FileUpload from "./components/FileUpload";
import NavBar from "./components/NavBar";
import ListFiles from "./components/ListFiles";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  const [select, setSelect] = useState(1);
  const clickFunction = () => {
    if (select === 1) setSelect(2);
    else setSelect(1);
  };

  return (
    <BrowserRouter>
      <div className="text-center flex flex-col items-center pt-5 h-[100vh] bg-[#ebdef4]">
        <div className="w-[600px]">
          <NavBar select={select} clickFunction={clickFunction} />

          <div className={`${select === 1 ? "block" : "hidden"} mt-4`}>
            <FileUpload />
          </div>
          <div className={`${select === 2 ? "block" : "hidden"} mt-4`}>
            <ListFiles />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
