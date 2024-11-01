import { useState } from "react";
import styles from "./Signup.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/FakeAuthContext";
import { Link } from "react-router-dom";
import ErrorComponent from "../components/ErrorComponent";


export default function SignUp() {
    // const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signup, isLoading, error } = useAuth();
    console.log(isLoading);

    async function handleSignup(e) {
        e.preventDefault();
        if(userName && email && password){
            signup(userName,email,password);
        }
    }
    return (
      <main className={styles.signup}>
        <PageNav />

        <form className={styles.form} onSubmit={handleSignup}>
          {error && <div className={styles.row}>
            <ErrorComponent>{error}</ErrorComponent>
          </div>}
          <div className={styles.row}>
            <label htmlFor="username">User name</label>
            <input
              type="text"
              id="username"
              onChange={(e) => setUserName(e.target.value)}
              placeholder="jack"
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jack@example.com"
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
            />
          </div>

          <div className={styles.row}>
            <Button type="primary" isLoading={isLoading}>
              Signup
            </Button>
          </div>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
            </span>
          </p>
        </form>
      </main>
    );
}