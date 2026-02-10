import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

function App() {
  const [user, setUser] = useState(null);
  const [msgSent, setMsgSent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkIfSession() {
      const res = await fetch("http://localhost:5000/isThereASession", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setUser(null);
        return navigate("/");
      }
      setUser(data.user);
      navigate("/hub");
    }
    checkIfSession();
  }, []);

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
