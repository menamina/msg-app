import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Index from "./components/index";

function App() {
  const [user, setUser] = useState(null);
  const [msgSent, setMsgSent] = useState(null);
  return (
    <div className="godDiv">
      <Index user={user} />
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
