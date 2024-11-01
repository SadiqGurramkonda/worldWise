import CityItem from "./CityItem";
import styles from "./CityList.module.css"
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import ErrorComponent from "./ErrorComponent";

function CityList() {
  const { cities, isLoading , error} = useCities();

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

    if(error){
      return <ErrorComponent>An Error ocuured!</ErrorComponent>
    }
  return (
    <div className={styles.cityList}>
      <ul >
        {cities.map((city) => (
          <CityItem city={city} key={city._id} />
        ))}
      </ul>
    </div>
  );
}

export default CityList;
