import React from "react";
import { IoSearch } from "react-icons/io5";
import { PiFinnTheHumanDuotone } from "react-icons/pi";
import { PiFinnTheHumanFill } from "react-icons/pi";
import { PiFinnTheHumanLight } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectUserName } from "../redux/user";

export default function NavLeft({ friends }) {
  const userName = useSelector(selectUserName);

  return (
    <div className="w-full p-3">
      <p className="text-left text-[28px] font-semibold py-2">Chats</p>
      <div className="w-full bg-[#f3f3f5] rounded-full px-3 py-2 flex justify-center items-center">
        <div className="div">
          <IoSearch className="text-[20px] text-[#c2c2c4]" />
        </div>
        <input
          type="text"
          className="bg-[#f3f3f5] w-full outline-none ml-2"
          placeholder="Search Messenger"
        />
      </div>

      <div className="py-4">
        {friends?.map((friend, key) => {
          if (friend.userName !== userName)
            return (
              <div
                key={key}
                className="px-2 py-3 bg-white rounded-lg flex items-center hover:bg-[#f5f5f5] transition-all cursor-pointer"
              >
                <div className="p-1 bg-white border border-gray-400 rounded-full relative">
                  {key % 3 === 0 && (
                    <PiFinnTheHumanDuotone className="text-[32px]" />
                  )}
                  {key % 3 === 1 && (
                    <PiFinnTheHumanFill className="text-[32px]" />
                  )}
                  {key % 3 === 2 && (
                    <PiFinnTheHumanLight className="text-[32px]" />
                  )}
                  {friend.isOnline === true && (
                    <div className="w-3 h-3 absolute rounded-full bg-green-600 right-0 bottom-0"></div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-opacity-100">
                    {friend.userName}
                  </p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
