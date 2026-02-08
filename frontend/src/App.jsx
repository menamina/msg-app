import { useState, useEffect } from "react";
import { Outlet } from "react-router";

function App() {
  const [user, setUser] = useState(null);
  const [msgSent, setMsgSent] = useState(null);
  return (
    <div class="godDiv">
      <div></div>
      <div></div>
    </div>
  );
}

export default App;
