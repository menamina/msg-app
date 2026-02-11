function Hub() {
  // click add new message click a + to upload a file+ add it to multer w formData
  // profile upload pictures + change name, change email + change password
  // add a friend -- delete a friend
  // delete messages -- in backend save messages as false if deleted
  // restore deleted msgs

  return (
    <div className="hubDiv">
      <div className="userNav"></div>
      <div>
        <div className="sideBar"></div>
        <div className="msgs"></div>
      </div>
    </div>
  );
}

export default Hub;
