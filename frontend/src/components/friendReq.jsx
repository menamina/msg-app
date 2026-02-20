import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function FriendReq() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [noFriendReqsMsg, setNoFriendReqsMsg] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function getFriendReqs() {
      try {
        const res = await fetch("http://localhost:5555/getFriendReqs", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          setNoFriendReqsMsg(data.message);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    getFriendReqs();
  }, []);

  return (
    <div>
      {noFriendReqsMsg && <div>{noFriendReqsMsg}</div>}
      {friendRequests && (
        <div>
          {friendRequests.map((request) => {
            return (
              <div>
                <div>
                  <img>{request.profile.pfp}</img>
                </div>
                <div>
                  <p>{request.name}</p>
                  <p>@{request.username}</p>
                </div>
                <div>
                  <form onSubmit={handleReqAction}>
                    <button className="add">add</button>
                    <button className="deny">deny</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FriendReq;
