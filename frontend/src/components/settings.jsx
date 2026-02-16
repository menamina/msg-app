import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Settings() {
  const { userProfile, setUserProfile } = useOutletContext();
  const [portrait, updatePortrait] = useState("");
  const [name, updateName] = useState("");
  const [email, updateEmail] = useState("");
  const [currentPass, updateCurrentPass] = useState("");
  const [newPass, updateNewPass] = useState("");

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
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Name:</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <input type="text" />
            </div>
            <div>
              <div>Update passowrd?</div>
            </div>
            <div classNAame="updatePass hidden">
              <div>
                <label htmlFor="">Current Password</label>
                <input type="text" />
              </div>
              <div>
                <label htmlFor="">New Password</label>
                <input type="text" />
              </div>
            </div>
            <div>
              <div>cancel</div>
              <button>save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
