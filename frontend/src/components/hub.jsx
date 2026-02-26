import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import Chat from "./chat";
import "../css/hub.css";

function Hub() {
  const { user, setUser, userProfile, setUserProfile, sideBar } =
    useOutletContext();

  const nav = useNavigate();

  const [friendReq, setFriendReq] = useState(false);

  const [showOpts, setShowOpts] = useState(false);
  const [showFriendSearch, setShowFriendSearch] = useState(false);
  const [noUsersFound, setNoUsersFound] = useState("");
  const [activeChatUser, setActiveChatUser] = useState(null);

  const [userSearch, setUserSearch] = useState("");
  const [msgSearchByContact, setMsgSearchByContact] = useState("");

  const [userSearchResults, setUserSearchResults] = useState([]);
  const [msgSearchByContactResults, setMsgSearchByContactResults] = useState(
    [],
  );

  useEffect(() => {
    if (!user) {
      nav("/");
    }
  }, [user, nav]);

  useEffect(() => {
    const interval = setInterval(() => {
      async function getFriendReqInt() {
        const res = await fetch(`http://localhost:5555/getFriendReqs`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          setUser(null);
          setUserProfile(null);
          nav("/");
          return;
        }
        if (res.status === 403) {
          return;
        } else {
          setFriendReq(true);
          return;
        }
      }

      getFriendReqInt();
    }, 3000);

    return () => clearInterval(interval);
  }, [nav, setUser, setUserProfile]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (userSearch.trim() === "") {
        setUserSearchResults([]);
        return;
      }

      async function fetchResults() {
        try {
          const res = await fetch(
            `http://localhost:5555/searchByUsername/search?query=${userSearch}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          const data = await res.json();

          if (res.status === 401) {
            setUser(null);
            setUserProfile(null);
            nav("/");
            return;
          }
          if (!res.ok) {
            setNoUsersFound(data.noUsersFound || "No user(s) found");
            setUserSearchResults([]);
            return;
          }

          setNoUsersFound("");
          setUserSearchResults(data.friendSearchRes || []);
        } catch (error) {
          console.log(error.message);
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
            `http://localhost:5555/sideBarChatSearch/search?query=${msgSearchByContact}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          const data = await res.json();

          if (res.status === 401) {
            setUser(null);
            setUserProfile(null);
            nav("/");
            return;
          }
          setMsgSearchByContactResults(data.sideBarChatSearchRes || []);
        } catch (error) {
          console.log(error);
        }
      }
      fetchResults();
    }, 300);
    return () => clearTimeout(timeout);
  }, [msgSearchByContact]);

  function profileOpts() {
    setShowOpts((prev) => !prev);
  }

  function openFriendSearchBar() {
    setShowFriendSearch((prev) => !prev);
  }

  async function sendFriendReq(e, username) {
    if (e) e.preventDefault();
    if (!username || !user) return;

    if (username === user.username) return;
    try {
      const res = await fetch("http://localhost:5555/sendFriendReq", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friendToAdd: username,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setUser(null);
        setUserProfile(null);
        nav("/");
        return;
      }
      if (!res.ok) {
        console.log(data.message);
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function clearUserSearch() {
    setShowFriendSearch(false);
    setUserSearch("");
    setUserSearchResults([]);
  }

  async function logout() {
    try {
      const res = await fetch("http://localhost:5555/signout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        return console.log(res.error);
      }
      setUser(null);
      setUserProfile(null);
      nav("/");
    } catch (error) {
      console.log(error.err.message);
    }
  }

  const defaultPfp = "http://localhost:5555/pfpIMG/default-avatar.png";
  const pfpSrc = userProfile?.pfp
    ? `http://localhost:5555/pfpIMG/${userProfile.pfp}`
    : defaultPfp;

  if (!user) return null;

  return (
    <div className="hubDiv">
      <div className="userNav">
        <div>Cyberspace</div>
        <div>
          <div>
            <Link to="/hub/friend-requests">
              {friendReq ? (
                <div className="symbolIfFriendReq">
                  <img />
                </div>
              ) : (
                <div></div>
              )}
            </Link>
          </div>
          <div className="nav-profile">
            <img src={pfpSrc} alt="your profile image" className="pfp" />
            <p onClick={profileOpts}>{user ? user.name : null}</p>
          </div>
          {showOpts ? (
            <div className="dropDown">
              <div>
                <div>
                  <div>@{user.name}</div>
                  <div>{user.email}</div>
                  <div>
                    <Link to="/hub/settings">settings</Link>
                  </div>
                </div>
              </div>
              <div>
                <Link to="/hub/contacts">contacts</Link>
              </div>
              <div onClick={logout}>logout</div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="sidebar-Msgs">
        <div className="sideBar">
          <div>
            <div>
              <Link to="/hub/new">new message</Link>
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
                            className="pfp"
                            src={
                              contact.profile?.pfp
                                ? `http://localhost:5555/pfpIMG/${contact.profile.pfp}`
                                : defaultPfp
                            }
                            alt="profile"
                          />
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
                              className="pfp"
                              src={
                                convo.profile?.pfp
                                  ? `http://localhost:5555/pfpIMG/${convo.profile.pfp}`
                                  : defaultPfp
                              }
                              alt="profile"
                            />
                          </div>
                        </div>
                        <div>{convo.toUser.name}</div>
                      </div>
                    );
                  })}
          </div>
        </div>
        <Chat activeChatUser={activeChatUser}></Chat>
        <Outlet
          context={{
            user,
            setUser,
            userProfile,
            setUserProfile,
          }}
        />
      </div>

      {showFriendSearch && (
        <div className="search">
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
            {userSearchResults.length > 0 ? (
              <div>
                {userSearchResults.map((result) => (
                  <div key={result.id} className="userSearchResult">
                    <form onSubmit={(e) => sendFriendReq(e, result.username)}>
                      <div>
                        <div>
                          <img
                            className="pfp"
                            src={
                              result.profile?.pfp
                                ? `http://localhost:5555/pfpIMG/${result.profile.pfp}`
                                : defaultPfp
                            }
                            alt="profile"
                          />
                        </div>
                      </div>

                      <div>
                        <p>{result.name}</p>
                        <p>@{result.username}</p>
                      </div>

                      <div>
                        {result.id === user.id ? null : (
                          <button type="submit">add</button>
                        )}
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            ) : userSearch.trim() !== "" ? (
              <div>{noUsersFound || "No user found"}</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Hub;
