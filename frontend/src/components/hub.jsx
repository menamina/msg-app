import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Hub() {
  // click add new message click a + to upload a file+ add it to multer w formData
  // profile upload pictures + change name, change email + change password
  // add a friend -- delete a friend
  // delete messages -- in backend save messages as false if deleted
  // restore deleted msgs
  const { user, sideBar, userProfile } = useOutletContext();
  const { showOpts, setShowOpts } = useState(false);
  const { openChat, setOpenChat } = useState(false);
  function profileOpts() {}

  async function openConvo(keyID) {
    try {
      const res = await fetch("http://localhost:5555/getConvo", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({
          withUserID: keyID
        })
      })

      const data = await res.json()

      if (!res.ok){
        return
      } else {
        setOpenChat(true)
      }

    } catch(error){
      console.log(error)
    }

  }

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
          {openChat ?
          <div></div>
          }
        </div>
      </div>
    </div>
  );
}

export default Hub;
