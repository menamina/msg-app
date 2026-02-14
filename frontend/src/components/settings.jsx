import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Settings() {
  const { userProfile, setUserProfile } = useOutletContext();

  return (
    <div className="profileDiv">
      <div>
        <div>
          <img src={userProfile.profile.pfp} alt="" />
        </div>
        <div>{userProfile.name}</div>
      </div>
      <div>
        <div>Settings</div>
        <div>
          <form>
            <div>
              <label htmlFor="">Portrait:</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Name:</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <input type="text" />
            </div>
            <div>
              <div>Update passowrd?</div>
            </div>
            <div>
              <div>
                <label htmlFor="">New Password</label>
                <input type="text" />
              </div>
              <div>
                <label htmlFor=""></label>
                <input type="text" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
