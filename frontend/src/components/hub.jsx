import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Hub() {
  // click add new message click a + to upload a file+ add it to multer w formData
  // profile upload pictures + change name, change email + change password
  // add a friend -- delete a friend
  // delete messages -- in backend save messages as false if deleted
  // restore deleted msgs
  const { user, msgs, msgsSent, userProfile } = useOutletContext();
  const { showOpts, setShowOpts } = useState(false);
  const sideBarUsers = [];
  function profileOpts() {}

  function checkSentReceived() {
    const allMsgs = [...msgs, ...msgsSent];
    const sorted = allMsgs.sort((a, b) => b.date - a.date);
    sorted.forEach((msg) => {
      const notMe = msg.from !== user.id ? msg.from : msg.to;
      const exists = sideBarUsers.find((user) => user.id === notMe);
      if (!exists) {
        sideBarUsers.push({
          id: notMe,
          name: msg.name,
          email: msg.email,
        });
      }
    });
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
            {textingUsr.length === 0
              ? null
              : textingUsr.map((user) => {
                  <div key={user.id}>
                    <div>{user.name}</div>
                  </div>;
                })}
          </div>
        </div>
        <div className="msgs"></div>
      </div>
    </div>
  );
}

export default Hub;
