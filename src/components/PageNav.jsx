import { NavLink, useLocation } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";

function PageNav() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li className={styles.home}>
          <NavLink to="/">Home</NavLink>
        </li>
        {!(
          location.pathname === "/login" || location.pathname === "/signup"
        ) && (
          <li>
            <NavLink to="/login" className={styles.ctaLink}>
              login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
