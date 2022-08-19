import React from "react";
// import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import "../index.css";

const FormData = (props) => {
  const nameRef = useRef();
  const msgRef = useRef();
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

  return (
    <React.Fragment>
      {!nameError && (
        <div className="max-w-md rounded-lg  shadow-lg p-10 mx-auto my-10">
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
          <div className="pb-44 p-10">
            {allMessages.map((msg, index) => (
              <p key={index} className="p-2 font-sans">
                {msg.name}: {msg.message}
                <hr></hr>
              </p>
            ))}
          </div>
          <footer className="w-full fixed inset-x-0 bottom-0 rounded-sm border-2   p-10 bg-slate-100">
            <form onSubmit={messageHandler}>
              <input
                className="shadow  border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-rounded focus:shadow-outline"
                placeholder="Write message here"
                ref={msgRef}
                type="text"
              ></input>

              <button className="border-2 hover:bg-slate-400 text-black font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline sm:ml-2 md:ml-5 lg:ml-10 ">
                Send message
              </button>
            </form>
          </footer>
        </>
      )}

      {/* {allMessages.map((msg, index) => (
        <p key={index}>
          {msg.name}: {msg.message}
        </p>
      ))} */}
    </React.Fragment>
  );
};

export default FormData;
