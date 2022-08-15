import React from "react";
import FormData from "./Components/FormData";
import io from "socket.io-client";

function App() {
  const socket = io.connect("http://localhost:3001");

  return (
    <div className="App">
      <FormData socket={socket} />
    </div>
  );
}

export default App;
