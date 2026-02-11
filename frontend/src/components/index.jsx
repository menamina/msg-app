import { Link } from "react-router-dom";

function Index() {
  return (
    <div className="index div">
      <div>
        <div>Welcome to Cyberspace,</div>
        <div>the messaging app</div>
        <div>where you can send messages from anywhere, to anyone</div>
      </div>

      <div>
        <Link to="/signup">Sign up</Link> today
      </div>
      <div>
        Or if you already have an account, <Link to="/login">login</Link>
      </div>
    </div>
  );
}

export default Index;
