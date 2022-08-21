import React from "react";
// import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import "../index.css";

const FormData = (props) => {
  const nameRef = useRef();
  const msgRef = useRef();
  const bottomRef = useRef();
  const [allMessages, setAllMessages] = useState([]);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const settingName = () => {
    if (nameRef.current.value === "") {
      alert("Please enter your name");
      setNameError(false);
    } else {
      setNameError(true);
      setName(nameRef.current.value);
      console.log("true");
    }
  };

  const messageHandler = async (e) => {
    e.preventDefault();
    const currentEntered = msgRef.current.value;
    msgRef.current.value = "";
    if (currentEntered === "") return;
    const newMessage = {
      name: name,
      message: currentEntered,
    };
    await props.socket.emit("send", newMessage);
    setAllMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    props.socket.on("receive", (data) => {
      setAllMessages((prev) => [...prev, data]);
    });
    return function cleanup() {
      props.socket.off("receive");
    };
  }, [props.socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [allMessages]);

  return (
    <React.Fragment>
      {!nameError && (
        <div className="max-w-md border-r border-b border-l border-t border-gray-300 rounded overflow-hidden shadow-lg  p-10 mx-auto my-10">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
            ref={nameRef}
            type="text"
          ></input>
          <button
            onClick={settingName}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Set Username
          </button>
        </div>
      )}

      {nameError && (
        <>
          <div className="pb-40 p-10  w-full">
            {allMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 font-sans m-4 rounded shadow-xl bg-blue-200 flex-1 max-w-sm ${(name===msg.name)?"ml-auto":"mr-auto"} `}
              >
                <p className="truncate font-semibold">{msg.message}</p>
                <p className="text-xs">{msg.name}</p>
              </div>
            ))}
          </div>
          <footer className="w-full fixed inset-x-0 bottom-0 rounded-sm border-2 p-10 mt-64">
            <form onSubmit={messageHandler}>
              <input
                className="shadow  border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-rounded focus:shadow-outline"
                placeholder="Write message here"
                ref={msgRef}
                type="text"
              ></input>

              <button className="border-2 bg-purple-400 hover:bg-green-400 text-white font-semibold py-2 px-3 rounded focus:outline-none focus:shadow-outline sm:ml-2 md:ml-5 lg:ml-10 ">
                Send ✈
              </button>
            </form>
          </footer>
        </>
      )}

    <div ref={bottomRef}></div>
    </React.Fragment>
  );
};

export default FormData;
