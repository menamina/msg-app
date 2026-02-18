import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function Settings() {
  const { user, setUser, userProfile, setUserProfile } = useOutletContext();
  const [portrait, setPortrait] = useState(userProfile.pfp);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const navigate = useNavigate();

  async function updateProfile(e) {
    e.preventDefault();

    const form = new FormData();
    if (currentPass && newPass) {
      form.append("currentPass", currentPass);
      form.append("newPass", newPass);
    }
    form.append("name", name);
    form.append("email", email);
    form.append("portrait", portrait);

    try {
      const res = await fetch("http://localhost:5555/updateProfile", {
        method: "PATCH",
        credentials: "incluide",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        return;
      }
      setUserProfile(data.profile);
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  }

  function cancelUpdate() {
    setPortrait(userProfile.pfp);
    setName(user.name);
    setEmail(user.email);
    navigate("/hub");
  }

  return (
    <div className="profileDiv">
      <div>
        <div>
          <img
            src={`http://localhost:5555/${userProfile.profile.pfp}`}
            alt="your profile image"
          />
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
