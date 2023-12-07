import React, { useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";

const Search = ({ setSearch }) => {
  const loginInputRef = useRef(null);

  const keyUpHandler = (ref, e) => {
    setSearch(ref.current.value);
  };

  return (
    <div className="w-full py-2 px-4 bg-white rounded-lg flex items-center">
      <CiSearch className="text-[24px] mr-4" />
      <input
        className="w-full outline-none text-[18px]"
        type="text"
        onKeyUp={(e) => keyUpHandler(loginInputRef, e)}
        ref={loginInputRef}
        placeholder="Search..."
      />
    </div>
  );
};

export default Search;
