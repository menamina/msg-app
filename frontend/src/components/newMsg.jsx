import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Chat from "./chat";

function NewMsg() {
  const { user } = useOutletContext();
  const nav = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user) nav("/");
  }, [user, nav]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        setErrorMsg("");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5555/searchByUsername/search?query=${query}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) {
          setResults([]);
          setErrorMsg(data.noUsersFound || "No users found");
          return;
        }
        setErrorMsg("");
        setResults(data.friendSearchRes || []);
      } catch (err) {
        setErrorMsg("Unable to search right now");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!user) return null;

  return (
    <div className="newMsg">
      <div className="searchBox">
        <label htmlFor="userSearch">Find a user to message</label>
        <input
          id="userSearch"
          value={query}
          placeholder="Search by username"
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading ? <div>Searching…</div> : null}
        {errorMsg ? <div>{errorMsg}</div> : null}
        {results.length > 0 ? (
          <div className="searchResults">
            {results.map((u) => (
              <button
                key={u.id}
                className="searchResult"
                onClick={() => setSelectedUserId(u.id)}
              >
                <div>{u.name}</div>
                <div>@{u.username}</div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="chatWrapper">
        <Chat user={user} activeChatUser={selectedUserId} />
      </div>
    </div>
  );
}

export default NewMsg;
