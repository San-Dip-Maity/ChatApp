import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
function App() {
  const [username, setUsername] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages([...messages, message]);
    });
    console.log(messages);
  }, [messages, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = {
      massage: newMessage,
      user: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    if (!newMessage == "") {
      socket.emit("send-message", messageData);
      setNewMessage("");
    } else {
      alert("Please enter a message");
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
        {chatActive ? (
          <div className="rounded-md p-2 w-full md:w-[80vw] lg:w-[40vw] mx-auto">
            <h1 className="text-center font-bold text-xl my-2 uppercase">
              Chat Room
            </h1>
            <div>
              <div className="overflow-y-scroll  h-[80vh] lg:h-[60vh]">
                {messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex rounded-md shadow-md my-5 w-fit ${
                        username === message.user && "ml-auto"
                      }`}
                    >
                      <div
                        className={`bg-green-400 flex justify-center items-center rounded-l-md ${
                          username === message.user && "bg-purple-400"
                        }`}
                      >
                        <h3 className="font-bold text-lg px-2">
                          {message.user.charAt(0).toUpperCase()}
                        </h3>
                      </div>
                      <div className="px-2 bg-white min-w-20 max-w-80 rounded-r-md overflow-auto">
                        <span className="text-sm text-teal-600 ">
                          {message.user}
                        </span>
                        <h3 className="font-bold">{message.massage}</h3>
                        <h3 className="text-xs text-right text-gray-400">
                          {message.time}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                className="flex gap-2 justify-between "
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="rounded-md border-2 outline-none px-3 py-2 w-full"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                />

                <button
                  type="submit"
                  className="px-3 py-2 bg-orange-400 hover:bg-orange-500 transition-all text-white rounded-md font-bold"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="h-screen w-screen flex justify-center items-center gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-center px-3 py-2 outline-none border-2 rounded-md "
            />
            <button
              type="submit"
              placeholder="Enter username 😊"
              className="bg-green-500 text-white px-3 py-2 rounded-md font-bold"
              onClick={() => {
                !username == "" && setChatActive(true);
              }}
            >
              Start Chat
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
