import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Signup() {
  async function signupAPI() {
    const form = new FormData();
    form.append("name");
  }

  return (
    <div className="signup div">
      <form onSubmi={signupAPI}>
        <div>
          <label htmlFor="">Name:</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Email:</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input type="password" />
        </div>

        <div>
          <label htmlFor="">Confirm Password:</label>
          <input type="password" />
        </div>
      </form>
    </div>
  );
}

export default Signup;
