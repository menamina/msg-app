import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Index(setUser) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function login() {
    try {
      const res = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="indexDiv">
      <div>
        <form onSubmit={login}>
          <div>
            <label>Email:</label>
            <input
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Password:</label>
            <input
              value={password}
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button>login</button>
        </form>
      </div>
      <div>
        <div>Dont already have an account?</div>
        <Link to="/signup">sign up!</Link>
      </div>
    </div>
  );
}

export default Index;
