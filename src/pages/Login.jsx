import { useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";

import Button from "../components/Button";
import { Link } from "react-router-dom";
import ErrorComponent from "../components/ErrorComponent";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const { login, error, isLoading, user} = useAuth();
  console.log(user);

  async function handleLogin(e) {    
    e.preventDefault();
    if ((email && password)) {
      login(email, password);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleLogin}>
        {error && (
          <div className={styles.row}>
            <ErrorComponent>{error}</ErrorComponent>
          </div>
        )}
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className={styles.row}>
          <Button type="primary" isLoading={isLoading}>
            Login
          </Button>
        </div>
        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/signup" className={styles.link}>
              Sign up
            </Link>
          </span>
        </p>
      </form>
    </main>
  );
}