import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Popup,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCallback, useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useURLPosition";
import { useRef } from "react";

function Map() {
  const { cities, currentCity } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  // const currentCityPosition = [currentCity?.position?.lat, currentCity?.position?.lng] || mapPosition;
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  // console.log(mapPosition);

  



  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      };
    },
    [mapLat,mapLng
    ]
  );

  const onClickShowMarker = useCallback(function onClickShowMarker() {
    if (currentCity.position) {
      const map = mapRef.current;
      if (map) {
        map.flyTo([currentCity?.position?.lat, currentCity?.position?.lng], 10);
      }

      const marker = markerRefs.current[`${currentCity.position.lat}--${currentCity.position.lng}`];
      if (marker) {
        marker.openPopup();
      }
    }
  },[currentCity])

  

  useEffect(function(){

    
    if(currentCity){
      onClickShowMarker()
    }

  },[currentCity, onClickShowMarker])

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);


  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <>
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your location"}
        </Button>
        </>
      )}

      <MapContainer
      center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}
        className={styles.map}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
          ref={(el)=>{markerRefs.current[`${city.position.lat}--${city.position.lng}`] =  el}}
            position={[city.position.lat, city.position.lng]}
            key={city._id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      return navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
