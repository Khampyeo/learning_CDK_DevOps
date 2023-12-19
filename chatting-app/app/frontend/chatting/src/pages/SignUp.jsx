import axios from "axios";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";

export default function SignUp() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState(null);

  const signUp = async (userName) => {
    setSuccess("pending");
    const url =
      "https://rzeatbuc84.execute-api.ap-southeast-1.amazonaws.com/prod/user";

    await axios
      .post(url, {
        userName,
      })
      .then(() => {
        setSuccess("success");
        console.log("sign up success");
      })
      .catch(() => {
        setSuccess("fail");
        console.log("sign up failed");
      });
    setInput("");
  };
  return (
    <div className="w-full h-[100vh] bg-[url('../public/img.png')] bg-cover bg-no-repeat flex justify-center items-center">
      <div className="w-[460px] bg-white h-[360px] rounded-xl  shadow-xl relative">
        {success !== "pending" ? (
          <div className="w-full h-full flex items-center flex-col px-5 py-8">
            <p className="text-[30px] font-bold">JOIN US!</p>
            <p>Fill in your username to sign up. </p>

            {success === "success" && (
              <p className="mt-10 text-[20px] text-green-700">
                Sign up success!
              </p>
            )}
            {success === "fail" && (
              <p className="mt-10 text-[20px] text-red-700">Sign up fail!</p>
            )}
            {success !== "success" && success !== "fail" && (
              <Fragment>
                <input
                  className={`mt-[32px] outline-none border-[2px] px-3 py-4 rounded-xl w-[300px] text-[20px]`}
                  type="text"
                  placeholder="Username"
                  value={input}
                  onInput={(e) => setInput(e.target.value)}
                  // onKeyDown={(event) => {
                  //   if (event.key === "Enter") {
                  //     signUp(input);
                  //   }
                  // }}
                />

                <button
                  onClick={() => signUp(input)}
                  className="px-4 py-3 bg-[#d5621a] text-[20px] font-semibold text-white rounded-xl mt-auto hover:bg-[#d5421a] transition-all cursor-pointer"
                >
                  SIGN UP
                </button>
              </Fragment>
            )}

            <button
              className="mt-4 text-[14px] hover:text-[#d5621a] transition-all mt-auto"
              onClick={() => {
                navigate("/signin");
              }}
            >
              ALREADY HAVE A ACCOUNT? SIGN IN NOW!
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <TbReload className="text-[40px] animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
