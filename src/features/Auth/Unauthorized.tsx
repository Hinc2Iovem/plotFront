import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <aside className="flex flex-col">
      <h1>Unauthorized</h1>
      <Link className="block" to="/auth/login">
        Log In
      </Link>
      <Link className="block" to="/">
        Home
      </Link>
    </aside>
  );
}
