import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [sideBar, setSideBar] = useState([]);
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
    if (!user) return;
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
        navigate("/hub");
      } catch (err) {
        console.log(err);
      }
    }
    getMsgs();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async function timer() {
      try {
        const res = await fetch("http://localhost:5555/getSideBar", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          console.log;
          return;
        } else {
          setSideBar(data.conversations);
        }
      } catch (error) {
        console.log(error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="godDiv">
      <Outlet
        context={{
          user,
          setUser,
          userProfile,
          setUserProfile,
          sideBar,
        }}
      ></Outlet>
    </div>
  );
}

export default App;
