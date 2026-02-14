import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

function Hub() {
  const { user, sideBar } = useOutletContext();
  const [showOpts, setShowOpts] = useState(false);
  const [convoMsg, setConvoMsg] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [sendToUser, setSendToUser] = useState(null);
  const [msgToSend, setMsgToSend] = useState("");
  const [userToFind, setUserToFind] = useState("");

  function profileOpts() {
    setShowOpts(true);
  }

  async function openConvo(keyID) {
    try {
      const res = await fetch("http://localhost:5555/getConvo", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          withUserID: keyID,
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
      setConvoMsg([filterOutDltdMsg]);
      return;
    } catch (error) {
      console.log(error);
    }
  }

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
      setMsgToSend("");
      setSendToUser(null);
    } catch (error) {
      console.log(error);
    }
  }

  function openFriendSearchBar() {
    const searchDiv = document.querySelector("search");
    searchDiv.classList.remove("hidden");
  }

  async function search4Friend() {
    try {
      const res = await fetch("http://localhost:5555/friendSearch", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userToFind,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return;
      }
      setFriendSearchResult(data.returnedUser);
    } catch (error) {
      console.log(error);
    }
  }

  // SINCE USING USERNAme sEARCH INSTEAD OF EMAIL DYNAMICALLY LOAD

  return (
    <div className="hubDiv">
      <div className="userNav">
        <div>Cyberspace</div>
        <div>
          <img></img>
          <div onClick={profileOpts}>{user ? user.name : null}</div>
        </div>
        {showOpts ? (
          <div className="dropDown hidden">
            <div>
              <div>
                <img></img>
              </div>
              <div>
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>
                  <Link to="/settings">settings</Link>
                </div>
              </div>
            </div>
            <div>
              <Link to="/contacts">contacts</Link>
            </div>
            <div>logout</div>
          </div>
        ) : null}
      </div>
      <div cclassName="sidebar+Msgs">
        <div className="sideBar">
          <div>
            <div onClick={openFriendSearchBar}>
              find your friends in cyberspace
            </div>
          </div>
          <div>
            {sideBar.length === 0
              ? null
              : sideBar.map((convo) => {
                  const keyID = convo.from === user.id ? convo.to : convo.from;
                  <div key={keyID} id={keyID} onClick={() => openConvo(keyID)}>
                    <div>
                      <div clasName="insertRanColor"></div>
                    </div>
                    <div>{convo.toUser.name}</div>
                  </div>;
                })}
          </div>
        </div>
        <div className="msgs">
          {chatOpen ? (
            <div>
              {convoMsg.map((msg) => {
                const isSenderTheLoggedInUser =
                  msg.from === user.id ? true : false;
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
                      <div onClick={deleteMsg}>x</div>
                    </div>
                  );
                }
              })}
              <div>
                <form onSubmit={sendMsg}>
                  <input
                    value={msgToSend}
                    onChange={(e) => setMsgToSend(e.target.value)}
                  ></input>
                  <button>
                    <img></img>
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="search hidden">
        <form onSubmit={search4Friend}>
          <label>search for a friend by username</label>
          <input
            value={userToFind}
            onChange={(e) => setUserToFind(e.target.value)}
          ></input>
          <button>cancel</button>
          <button>search</button>
        </form>
      </div>
    </div>
  );
}

export default Hub;
