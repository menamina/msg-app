import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [msgsSent, setMsgSent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkIfSession() {
      const res = await fetch("http://localhost:5555/isThereASession", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setUser(null);
        return;
      }
      setUser(data.user);
    }
    checkIfSession();
  }, []);

  useEffect(() => {
    async function getMsgs() {
      try {
        const res = await fetch("http://localhost:5555/getUserProfile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          return console.log("something");
        }
        setUserProfile(data.userInfo.profile);
        setMsgs(data.userInfo.received);
        setMsgSent(data.userInfo.sent);
        navigate("/hub");
      } catch (err) {
        console.log(err);
      }
    }
    getMsgs();
  }, [user]);

  return (
    <div className="godDiv">
      <Outlet
        context={{
          user,
          setUser,
          msgsSent,
          setMsgSent,
          msgs,
          setMsgs,
          userProfile,
          setUserProfile,
        }}
      ></Outlet>
    </div>
  );
}

export default App;
