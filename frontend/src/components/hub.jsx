import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

// WORK ON SEARCH CONTROLLER

function Hub() {
  const { user, sideBar } = useOutletContext();

  const [showOpts, setShowOpts] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [convoMsg, setConvoMsg] = useState([]);
  const [sendToUser, setSendToUser] = useState(null);
  const [msgToSend, setMsgToSend] = useState("");
  const [fileToSend, setFileToSend] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [msgSearchByContact, setMsgSearchByContact] = useState("");

  const [userSearchResults, setUserSearchResults] = useState([]);
  const [msgSearchByContactResults, setMsgSearchByContactResults] = useState(
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (userSearch.trim() === "") {
        userSearchResults([]);
        return;
      }

      async function fetchResults() {
        try {
          const res = await fetch(
            `http://localhost:55555/search?query=${userSearch}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          const data = await res.json();

          setUserSearchResults(data.userSearchResults);
        } catch (error) {
          console.log(error);
        }
      }
      fetchResults();
    }, 300);
    return () => clearTimeout(timeout);
  }, [userSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (msgSearchByContact.trim() === "") {
        setMsgSearchByContactResults([]);
        return;
      }

      async function fetchResults() {
        try {
          const res = await fetch(
            `http://localhost:55555/search?query=${msgSearchByContact}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          const data = await res.json();

          setMsgSearchByContactResults(data.usermsgSearchByContactResults);
        } catch (error) {
          console.log(error);
        }
      }
      fetchResults();
    }, 300);
    return () => clearTimeout(timeout);
  }, [msgSearchByContact]);

  function profileOpts() {
    setShowOpts(true);
  }

  function openFriendSearchBar() {
    const searchDiv = document.querySelector("search");
    searchDiv.classList.remove("hidden");
  }

  function removeFile() {
    setFileToSend("");
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
      setConvoMsg([filterOutDltdMsg]);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async function sendFriendReq(userID) {
    try {
      const res = await fetch("http://localhost:5555/sendFriendReq", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          requestedFriend: userID,
        }),
      });

      const data = res.json();

      if (!res.ok) {
        console.log(data.errors);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  function clearUserSearch() {
    const searchDiv = document.querySelector("search");
    searchDiv.classList.add("hidden");
    setUserSearch("");
    setUserSearchResults([]);
  }

  return (
    <div className="hubDiv">
      <div className="userNav">
        <div>Cyberspace</div>
        <div>
          <img
            src={`http://localhost:5555/${user.profile.pfp}`}
            alt="your profile image"
          ></img>
          <div onClick={profileOpts}>{user ? user.name : null}</div>
        </div>
        {showOpts ? (
          <div className="dropDown hidden">
            <div>
              <div>
                <div>@{user.name}</div>
                <div>@{user.email}</div>
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
            <input
              name="search chats by user"
              placeholder="Search"
              value={msgSearchByContact}
              onChange={(e) => setMsgSearchByContact(e.target.value)}
            ></input>
          </div>
          <div>
            {msgSearchByContactResults.length === 0 ? null : (
              <div>
                {msgSearchByContact.map((contact) => {
                  <div key={contact.id}>
                    <div>
                      <div>
                        <img
                          src={`http://localhost:5555/${contact.profile.pfp}`}
                          alt="your profile image"
                        ></img>
                      </div>
                    </div>
                    <div>{contact.name}</div>
                  </div>;
                })}
              </div>
            )}
            {sideBar.length === 0
              ? null
              : sideBar.map((convo) => {
                  const keyID = convo.from === user.id ? convo.to : convo.from;
                  <div key={keyID} id={keyID} onClick={() => openConvo(keyID)}>
                    <div>
                      <div>
                        <img
                          src={`http://localhost:5555/${convo.profile.pfp}`}
                          alt="your profile image"
                        ></img>
                      </div>
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
                      <input
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
      </div>

      <div className="search hidden">
        <div>
          <label>search for a friend by username</label>
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search.."
          ></input>
          <div>
            <button onClick={clearUserSearch}>cancel</button>
          </div>
        </div>
        <div className="searchResults">
          {userSearchResults ? (
            <div>
              {userSearchResults.map((result) => {
                <div key={result.id} className="userSearchResult">
                  <form onSubmit={sendFriendReq(result.id)}>
                    <div>
                      <div>
                        <img
                          src={`http://localhost:5555/${result.profile.pfp}`}
                          alt="your profile image"
                        ></img>
                      </div>
                    </div>

                    <div>
                      <p>{result.name}</p>
                      <p>@{result.username}</p>
                    </div>

                    <div>
                      <button>add</button>
                    </div>
                  </form>
                </div>;
              })}
            </div>
          ) : (
            <div>No user found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hub;
