import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import "../css/loginSignup.css";

function Login() {
  const { user, setUser } = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState(null);
  const [passErr, setPassErr] = useState(null);
  const [otherErr, setOtherErr] = useState(null);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5555/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        data.message === "invalid email"
          ? setEmailErr("Invalid email")
          : setPassErr("Invalid password");
      } else {
        setUser(data.user);
        console.log(user);
        navigate("/hub");
      }
    } catch (error) {
      setOtherErr(error.message);
    }
  }

  return (
    <div className="login-div">
      <div>
        {otherErr ? <div>{otherErr}</div> : null}
        {emailErr ? <div>{emailErr}</div> : null}
        {passErr ? <div>{passErr}</div> : null}
        <form onSubmit={login} className="loginForm">
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
          <button className="logBtn">login</button>
        </form>
      </div>
      <div>
        <div>Dont already have an account?</div>
        <Link to="/signup" className="signup">
          sign up!
        </Link>
      </div>
    </div>
  );
}

export default Login;
