import { useEffect, useState } from "react";

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

  async function deleteFriend(contactID) {
    try {
      const res = await fetch("http://localhost:5555/dltFriend", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleteThisID: contactID,
        }),
      });

      if (!res.ok) {
        return;
      }
      const filteredContacts = contacts.filter(
        (contact) => contact.id !== contactID,
      );
      setContacts([filteredContacts]);
      return;
    } catch (error) {
      setErrors(error.error);
    }
  }

  return (
    <div>
      {errors && <div>{errors}</div>}
      {noFriends && <div>{noFriends}</div>}
      {contacts && (
        <div>
          {contacts.map((contact) => (
            <div key={contact.contactID}>
              <div>
                <div>
                  <img
                    src={`http://localhost:5555/pfpIMG/${contact.contact.profile.pfp}`}
                    alt={`${contact.contact.name} profile`}
                  />
                </div>
                <div>
                  <div>{contact.contact.name}</div>
                  <div>@{contact.contact.username}</div>
                </div>
              </div>
              <div>
                <div>message</div>
                <div onClick={() => deleteFriend(contact.contactID)}>
                  delete friend
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Contacts;
