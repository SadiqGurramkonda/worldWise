import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

function CityItem({ city }) {
  const { cityName, date, emoji, id, position } = city;
  const { currentCity, removeCity } = useCities();
  console.log(id, currentCity);

  function handleRemoveCity(e) {
    e.preventDefault();
    removeCity(id);
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <button className={styles.deleteBtn} onClick={handleRemoveCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
