import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Settings() {
  const { userProfile, setUserProfile } = useOutletContext();
  const [portrait, setPortrait] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  async function updateProfile() {
    const form = new FormData();
    try {
      const res = await fetch("http://localhost:5555/updateProfile", {
        method: "PATCH",
        credentials: "incluide",
      });
    } catch (error) {
      console.log(error);
    }
  }

  function cancelUpdate() {}

  return (
    <div className="profileDiv">
      <div>
        <div>
          <img src={userProfile.profile.pfp} alt="" />
        </div>
        <div>{userProfile.name}</div>
      </div>
      <div>
        <div>Settings</div>
        <div>
          <form onSubmit={updateProfile}>
            <div>
              <label htmlFor="">Portrait:</label>
              <img>portrait here</img>
              <input
                type="file"
                name="file"
                value={portrait}
                onChange={(e) => setPortrait(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div>Update passowrd?</div>
            </div>
            <div classNAame="updatePass hidden">
              <div>
                <label htmlFor="">Current Password</label>
                <input
                  type="text"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">New Password</label>
                <input
                  type="text"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div onClick={cancelUpdate}>cancel</div>
              <button>save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
