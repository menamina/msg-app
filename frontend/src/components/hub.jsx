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
  function profileOpts() {}

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
                <div>settings</div>
              </div>
            </div>
            <div>contacts</div>
            <div>logout</div>
          </div>
        ) : null}
      </div>
      <div cclassName="sidebar+Msgs">
        <div className="sideBar"></div>
        <div className="msgs"></div>
      </div>
    </div>
  );
}

export default Hub;
