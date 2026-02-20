import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [noFriends, setNoFriends] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function getContacts() {
      const res = await fetch("http://localhost:5555/getFriends", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setNoFriends(data.message);
        return;
      }

      setNoFriends(null);
      setContacts(data.friends);
    }
    getContacts();
  }, []);
}

export default Contacts;
