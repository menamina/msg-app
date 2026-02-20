import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Chat({ activeChatUser }) {
  const { user } = useOutletContext();

  const [chatOpen, setChatOpen] = useState(false);
  const [convoMsg, setConvoMsg] = useState([]);
  const [sendToUser, setSendToUser] = useState(null);
  const [msgToSend, setMsgToSend] = useState("");
  const [fileToSend, setFileToSend] = useState("");

  useEffect(() => {
    if (!activeChatUser) {
      setChatOpen(false);
      setConvoMsg([]);
      setSendToUser(null);
      return;
    }

    async function openConvo() {
      try {
        const res = await fetch("http://localhost:5555/getMsgs", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            withUserID: activeChatUser,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          return;
        } else {
          setConvoMsg(data.one2one);
          setSendToUser(data.friendID);
          setChatOpen(true);
        }
      } catch (error) {
        console.log(error);
      }
    }

    openConvo();
  }, [activeChatUser]);

  function removeFile() {
    setFileToSend("");
  }

  function showAddFileInput() {
    const addFile = document.querySelector(".addFile");
    addFile.className.remove("hidden");
  }

  // must update this api to send in a form data so multer can accept
  async function sendMsg() {
    try {
      const res = await fetch("http://localhost:5555/sendMsg", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sendTo: sendToUser,
          message: msgToSend,
        }),
      });

      if (!res.ok) {
        return;
      }
      setFileToSend("");
      setMsgToSend("");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMsg(msgID) {
    try {
      const res = await fetch("http://localhost:5555/dltMsg", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          msgToDelete: msgID,
        }),
      });

      if (!res.ok) {
        return;
      }
      const filterOutDltdMsg = convoMsg.filter((msg) => msg.id !== msgID);
      setConvoMsg(filterOutDltdMsg);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="msgs">
      {chatOpen ? (
        <div>
          {convoMsg.map((msg) => {
            const isSenderTheLoggedInUser = msg.from === user.id ? true : false;
            if (isSenderTheLoggedInUser) {
              return (
                <div className="me" key={msg.id}>
                  <div>
                    <div>
                      <div>{msg.message}</div>
                      <div>{msg.date}</div>
                    </div>
                    <div onClick={() => deleteMsg(msg.id)}>x</div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="other" key={msg.id}>
                  <div>
                    <div>{msg.message}</div>
                    <div>{msg.date}</div>
                  </div>
                  <div onClick={() => deleteMsg(msg.id)}>x</div>
                </div>
              );
            }
          })}
          <div>
            <form onSubmit={sendMsg}>
              <div>
                {fileToSend ? (
                  <div>
                    <div onClick={removeFile}>X</div>
                    <img src={fileToSend}></img>
                  </div>
                ) : null}
                <div>
                  <input
                    value={msgToSend}
                    onChange={(e) => setMsgToSend(e.target.value)}
                  ></input>
                  <button type="button" onClick={showAddFileInput}>
                    +
                  </button>
                  <input
                    className="addFile hidden"
                    type="file"
                    value={fileToSend}
                    onChange={(e) => setFileToSend(e.target.value)}
                  ></input>
                </div>
              </div>
              <button>
                <img></img>
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Chat;
