import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Signup() {
  const { user } = useOutletContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/hub");
    }
  }, [user]);

  async function signupAPI() {
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          confirmPass: confirmPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return console.log(data.error);
      } else navigate("/login");
    } catch (error) {
      console.log("something went wrong trying to signup", error.message);
    }
  }

  return (
    <div className="signup div">
      <form onSubmi={signupAPI}>
        <div>
          <label htmlFor="">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Confirm Password:</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
      </form>
      <div>
        <div>Already have an account?</div>
        <Link to="/login">login</Link>
      </div>
    </div>
  );
}

export default Signup;
