import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [noFriends, setNoFriends] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function getContacts() {
      try {
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
      } catch (error) {
        setErrors(error.message);
      }
    }
    getContacts();
  }, []);

  return (
    <div>
      {contacts && (
        <div>
          {contacts.map((contact) => {
            <div key={contact.id}>
              <div>
                <div>message</div>
                <div>delete</div>
              </div>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

export default Contacts;
