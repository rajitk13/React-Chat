import React from "react";
// import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";

const FormData = (props) => {
  const nameRef = useRef();
  const msgRef = useRef();
  const [allMessages, setAllMessages] = useState([]);
  const [name, setName] = useState("");
  const settingName = () => {
    setName(nameRef.current.value);
  };

  const messageHandler = async (e) => {
    const currentEntered = msgRef.current.value;
    msgRef.current.value = "";
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
      <input
        placeholder="Enter your username"
        ref={nameRef}
        type="text"
      ></input>
      <button onClick={settingName}>Set Username</button>
      <input placeholder="Write message here" ref={msgRef} type="text"></input>
      <button onClick={messageHandler}>Send message</button>

      {allMessages.map((msg, index) => (
        <p key={index}>
          {msg.name}: {msg.message}
        </p>
      ))}
    </React.Fragment>
  );
};

export default FormData;
