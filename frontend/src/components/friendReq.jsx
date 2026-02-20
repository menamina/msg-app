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
        setFriendRequests(data.requests);
      } catch (error) {
        console.log(error);
      }
    }
    getFriendReqs();
  }, []);

  async function handleReqAction(e) {
    e.preventDefault();

    const action = e.nativeEvent.submitter;

    if (action === "add") {
      try {
        const requestId = e.currentTarget.dataset.id;
        const res = await fetch("http://localhost:5555/acceptFriendReq", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: {
            friendToAccept: requestId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (action === "deny") {
      try {
      } catch (error) {
        console.log(error);
      }
    }
  }

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
                  <form onSubmit={handleReqAction} data-id={request.id}>
                    <button value="add">add</button>
                    <button value="deny">deny</button>
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
