import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Signup() {
  const { user } = useOutletContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [signUpErrs, setSignUpErrs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/hub");
    }
  }, [user]);

  async function signupAPI(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5555/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword: confirmPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message) {
          setSignUpErrs([data.message]);
          return;
        }

        if (data.errors) {
          setSignUpErrs(data.errors.map((e) => e.msg));
          return;
        }
      } else {
        setSignUpErrs([]);
        navigate("/login");
      }
    } catch (error) {
      console.log("something went wrong trying to signup", error.message);
    }
  }

  return (
    <div className="signup-div">
      {signUpErrs ? signUpErrs.map((err, i) => <div key={i}>{err}</div>) : null}
      <form onSubmit={signupAPI} className="loginForm">
        <div>
          <label htmlFor="">Name:</label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Email:</label>
          <input
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Confirm Password:</label>
          <input
            name="confirmPassword"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
        <button class="signBtn">sign up</button>
      </form>
      <div>
        <div>Already have an account?</div>
        <Link to="/login" className="login">
          login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
