import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function Settings() {
  const { user, setUser, userProfile, setUserProfile } = useOutletContext();
  const [portrait, setPortrait] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !userProfile) {
      return;
    }
    setPortrait(userProfile.pfp);
    setName(user.name);
    setEmail(user.email);
  }, [user, userProfile]);

  async function updateProfile(e) {
    e.preventDefault();

    const form = new FormData();
    if (currentPass && newPass) {
      form.append("currentPass", currentPass);
      form.append("newPassword", newPass);
    }
    form.append("name", name);
    form.append("email", email);
    if (portrait) {
      form.append("file", portrait);
    }

    try {
      const res = await fetch("http://localhost:5555/updateProfile", {
        method: "PATCH",
        credentials: "include",
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

  if (!user || !userProfile) return null;
  const pfpSrc = userProfile.pfp
    ? `http://localhost:5555/pfpIMG/${userProfile.pfp}`
    : "http://localhost:5555/pfpIMG/default-avatar.png";

  return (
    <div className="profileDiv">
      <div>
        <div>
          <img src={pfpSrc} alt="your profile image" />
        </div>
        <div>{userProfile.name}</div>
      </div>
      <div>
        <div>Settings</div>
        <div>
          <form onSubmit={updateProfile}>
            <div>
              <label htmlFor="">Portrait:</label>
              <img />
              <input
                type="file"
                name="file"
                onChange={(e) => setPortrait(e.target.files[0])}
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
