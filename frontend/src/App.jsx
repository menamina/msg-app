import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [msgSent, setMsgSent] = useState(null);
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
    if (user) {
      // get messages in hub + set them + user profile settings + set user profile settings
      navigate("/hub");
    }
  }, [user]);

  useEffect(() => {
    async function getMsgs() {
      try {
        const res = await fetch("http://localhost:5555/getMsgs", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          return console.log("something");
        }
        setMsgs(//st the objs here send back the fromUser + msg + time + date);
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
          msgSent,
          setMsgSent,
        }}
      ></Outlet>
    </div>
  );
}

export default App;
