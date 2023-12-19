import React, { useEffect, useState } from "react";
import NavLeft from "../component/NavLeft";
import BodyChat from "../component/BodyChat";
import { w3cwebsocket } from "websocket";
import { useDispatch, useSelector } from "react-redux";
import { selectUserName, setUserName } from "../redux/user";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChattingPage() {
  const [client, setClient] = useState(null);
  const userName = useSelector(selectUserName);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const fetchData = async () => {
    const response = await axios.get(
      "https://rzeatbuc84.execute-api.ap-southeast-1.amazonaws.com/prod/users"
    );
    const data = response.data.data;
    setFriends(data);
  };

  useEffect(() => {
    if (userName === null) {
      navigate("/signIn");
    }
    const ws = new w3cwebsocket(
      process.env.SOCKET_URL ||
        "wss://e224k6k33d.execute-api.ap-southeast-1.amazonaws.com/dev/"
    );
    ws.onopen = () => {
      fetchData();
      const body = {
        action: "setConnectionId",
        userName,
      };
      ws.send(JSON.stringify(body));
    };
    ws.onclose = () => {
      console.log("ws closed");
      setFriends([]);
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.name === "connectionChanged") {
        fetchData();
      }
      if (data.name === "message") {
        console.log("oldMessages: ", messages);

        data.time = new Date().getTime();

        messages.push(data);

        const newMessages = [...messages];

        console.log("new messages: ", newMessages);

        setMessages(newMessages);
      }
    };
    setClient(ws);
    return () => {
      dispatch(setUserName(null));
      ws.close();
    };
  }, []);

  const reconnectWs = (ws) => {
    console.log(ws.readyState);
  };

  const sendMessageToAll = (input) => {
    if (input && input.length > 0) {
      const body = {
        action: "sendMessageToAll",
        userName: userName,
        message: input,
      };

      client.send(JSON.stringify(body));
    }
  };

  const sendMessagePrivate = () => {
    return;
  };

  return (
    <div className="flex w-full h-[100vh]" onClick={() => reconnectWs(client)}>
      <div className="bg-white h-full shrink-0 w-[350px]">
        <NavLeft friends={friends} />
      </div>
      <div className="bg-white h-full flex-1 border-x-[1px] border-[#eaeaea] max-w-[800px]">
        <BodyChat messages={messages} sendMessageToAll={sendMessageToAll} />
      </div>
      {/* <div className="bg-yellow-200 h-full w-[25%]"></div> */}
    </div>
  );
}