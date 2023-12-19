import axios from "axios";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import { setUserName } from "../redux/user";

export default function SignIn() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();

  const signIn = (userName) => {
    setSuccess("pending");
    const url =
      "https://rzeatbuc84.execute-api.ap-southeast-1.amazonaws.com/prod/user";
    axios
      .get(url, {
        params: {
          userName,
        },
      })
      .then((response) => {
        if (response.data.message === "SUCCESS") {
          setSuccess("success");
          dispatch(setUserName(response.data.data.userName));
          console.log("sign in success");
          navigate("/chatting");
        } else {
          setSuccess("");
          console.log("sign in failed");
        }
      })
      .catch(() => {
        setSuccess("");
        console.log("sign in failed");
      });
    setInput("");
  };
  return (
    <div className="w-full h-[100vh] bg-[url('../public/img.png')] bg-cover bg-no-repeat flex justify-center items-center">
      <div className="w-[460px] bg-white h-[360px] rounded-xl flex items-center flex-col px-5 py-8 shadow-xl">
        {success !== "pending" ? (
          <Fragment>
            <p className="text-[30px] font-bold">LOG IN</p>
            <p>Fill in your username to sign in. </p>
            <input
              className="mt-[40px] outline-none border-[2px] px-3 py-4 rounded-xl w-[300px] text-[20px]"
              type="text"
              placeholder="Username"
              value={input}
              onInput={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                }
              }}
            />
            <button
              onClick={() => signIn(input)}
              className="px-5 py-3 bg-[#d5621a] text-[20px] font-semibold text-white rounded-xl mt-auto hover:bg-[#d5421a] transition-all cursor-pointer"
            >
              SIGN IN
            </button>
            <button
              className="mt-4 text-[12px] hover:text-[#d5621a] transition-all"
              onClick={() => {
                navigate("/signup");
              }}
            >
              DON'T HAVE A ACCOUNT? CREATE ONE!
            </button>
          </Fragment>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <TbReload className="text-[40px] animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
