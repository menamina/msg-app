import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Chat from "./chat";

// IF THERE ARE FRIEND REQUESTS SHOW THEM WITH A RED DOT OR SOMETHING AND THEN
// WHEN USER CLICKS IT TAKES THEM TO FRIEND REQ COMP

function Hub() {
  const { user, sideBar } = useOutletContext();

  const [friendReq, setFriendReq] = useState(false);

  const [showOpts, setShowOpts] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const [userSearch, setUserSearch] = useState("");
  const [msgSearchByContact, setMsgSearchByContact] = useState("");

  const [userSearchResults, setUserSearchResults] = useState([]);
  const [msgSearchByContactResults, setMsgSearchByContactResults] = useState(
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      async function getFriendReqInt() {
        const res = fetch(`http://localhost:55555/getFriendReqs`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 403) {
          return;
        }

        setFriendReq(true);
      }

      getFriendReqInt;
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (userSearch.trim() === "") {
        setUserSearchResults([]);
        return;
      }

      async function fetchResults() {
        try {
          const res = await fetch(
            `http://localhost:55555/searchByUsername/search?query=${userSearch}`,
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
            `http://localhost:55555/sideBarChatSearch/search?query=${msgSearchByContact}`,
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

  async function sendFriendReq(userEmail) {
    try {
      const res = await fetch("http://localhost:5555/sendFriendReq", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          firnedToAdd: userEmail,
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
          <div>
            <Link to="/friendReq">
              {friendReq ? (
                <div className="symbolIfFriendReq">
                  <img></img>
                </div>
              ) : (
                <img></img>
              )}
            </Link>
          </div>
          <div>
            <img
              src={`http://localhost:5555/pfpIMG/${user.profile.pfp}`}
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
      </div>
      <div cclassName="sidebar+Msgs">
        <div className="sideBar">
          <div>
            <div>
              <Link to="/newMsg">new message</Link>
            </div>
          </div>
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
                {msgSearchByContactResults.map((contact) => {
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setActiveChatUser(contact.id)}
                    >
                      <div>
                        <div>
                          <img
                            src={`http://localhost:5555/pfpIMG/${contact.profile.pfp}`}
                            alt="your profile image"
                          ></img>
                        </div>
                      </div>
                      <div>{contact.name}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {msgSearchByContact.trim() !== ""
              ? null
              : sideBar.length === 0
                ? null
                : sideBar.map((convo) => {
                    const keyID =
                      convo.from === user.id ? convo.to : convo.from;
                    return (
                      <div
                        key={keyID}
                        id={keyID}
                        onClick={() => setActiveChatUser(keyID)}
                      >
                        <div>
                          <div>
                            <img
                              src={`http://localhost:5555/pfpIMG/${convo.profile.pfp}`}
                              alt="your profile image"
                            ></img>
                          </div>
                        </div>
                        <div>{convo.toUser.name}</div>
                      </div>
                    );
                  })}
          </div>
        </div>
        <Chat activeChatUser={activeChatUser}></Chat>
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
                  <form onSubmit={sendFriendReq(result.email)}>
                    <div>
                      <div>
                        <img
                          src={`http://localhost:5555/pfpIMG/${result.profile.pfp}`}
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
