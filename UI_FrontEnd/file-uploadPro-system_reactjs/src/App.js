import React, { useState } from "react";

import "./App.css";
import FileUpload from "./components/FileUpload";
import NavBar from "./components/NavBar";
import ListFiles from "./components/ListFiles";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  const [select, setSelect] = useState(1);

  return (
    <BrowserRouter>
      <div className="text-center flex flex-col items-center pt-5 min-h-[100vh] bg-[#ebdef4] px-2">
        <div className="md:w-[600px] w-full">
          <NavBar select={select} setSelect={setSelect} />

          <div className={`${select === 1 ? "block" : "hidden"} mt-4`}>
            <FileUpload />
          </div>
          {select === 2 && (
            <div className={` mt-4`}>
              <ListFiles select={select} />
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
