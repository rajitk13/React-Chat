import React from "react";
import FormData from "./Components/FormData";
import io from "socket.io-client";
import Header from "./Components/Header";
import "./index.css";

function App() {
  const socket = io.connect("http://localhost:3001");

  return (
    <div className="App">
      <Header />
      <FormData socket={socket} />
    </div>
  );
}

export default App;
