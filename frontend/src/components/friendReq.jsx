import { useState, useEffect } from "react";

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
        setErrors(error);
      }
    }
    getFriendReqs();
  }, []);

  const defaultPfp = "http://localhost:5555/pfpIMG/default-avatar.png";

  async function handleReqAction(e) {
    e.preventDefault();

    const action = e.nativeEvent.submitter.value;
    const requestId = Number(e.currentTarget.dataset.id);

    if (action === "add" && requestId) {
      try {
        const res = await fetch("http://localhost:5555/acceptFriendReq", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            friendToAccept: requestId,
          }),
        });
        if (res.ok) {
          const filteredReqs = friendRequests.filter(
            (personWhoWantsToAddME) =>
              personWhoWantsToAddME.whoSent.id !== requestId,
          );
          setFriendRequests(filteredReqs);
          return;
        }
      } catch (error) {
        setErrors(error);
      }
    }

    if (action === "deny" && requestId) {
      try {
        const res = await fetch("http://localhost:5555/denyFriendReq", {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            friendToDeny: requestId,
          }),
        });
        if (res.ok) {
          const filteredReqs = friendRequests.filter(
            (personWhoWantsToAddME) =>
              personWhoWantsToAddME.whoSent.id !== requestId,
          );
          setFriendRequests(filteredReqs);
          return;
        }
      } catch (error) {
        setErrors(error);
      }
    }
  }

  return (
    <div className="friendReq">
      {errors && <div>{errors}</div>}
      {noFriendReqsMsg && <div>{noFriendReqsMsg}</div>}
      {friendRequests && (
        <div>
          {friendRequests.map((request) => {
            return (
              <div key={request.id}>
                <div>
                  <img
                    className="pfp"
                    src={
                      request.whoSent?.profile?.pfp
                        ? `http://localhost:5555/pfpIMG/${request.whoSent.profile.pfp}`
                        : defaultPfp
                    }
                    alt={`${request.whoSent?.name || "user"} profile`}
                  />
                </div>
                <div>
                  <p>{request.whoSent?.name}</p>
                  <p>@{request.whoSent?.username}</p>
                </div>
                <div>
                  <form
                    onSubmit={handleReqAction}
                    data-id={request.whoSent?.id}
                  >
                    <button type="submit" value="add">
                      add
                    </button>
                    <button type="submit" value="deny">
                      deny
                    </button>
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
