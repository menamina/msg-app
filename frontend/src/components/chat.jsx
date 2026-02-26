import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Chat() {
  const { user, activeChatUser } = useOutletContext();

  const [convoMsg, setConvoMsg] = useState([]);
  const [sendToUser, setSendToUser] = useState(null);
  const [msgToSend, setMsgToSend] = useState("");
  const [fileToSend, setFileToSend] = useState("");

  useEffect(() => {
    if (!activeChatUser) {
      setConvoMsg([]);
      setSendToUser(null);
      return;
    }

    async function openConvo() {
      try {
        const res = await fetch("http://localhost:5555/getMsgs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            friendID: activeChatUser,
          }),
        });

        const data = await res.json();

        if (res.status === 401) {
          return;
        }
        if (!res.ok) {
          return;
        } else {
          setConvoMsg(data.one2one);
          setSendToUser(data.friendID);
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
    addFile.classList.remove("hidden");
  }

  async function sendMsg(e) {
    e.preventDefault();
    try {
      if (fileToSend) {
        const form = new FormData();
        form.append("sendTo", sendToUser);
        form.append("message", msgToSend);
        form.append("fileOrImg", fileToSend);

        const res = await fetch("http://localhost:5555/sendMsg", {
          method: "POST",
          credentials: "include",
          body: form,
        });

        if (res.ok) {
          setFileToSend(null);
          setMsgToSend(null);
        }

        return;
      }

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
      {activeChatUser ? (
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
                    onChange={(e) => setFileToSend(e.target.files[0])}
                  ></input>
                </div>
              </div>
              <button>
                <img></img>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Chat;
