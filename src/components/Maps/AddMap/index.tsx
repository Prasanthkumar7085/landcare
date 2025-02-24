import GoogleMapComponent from "@/components/Core/GoogleMap";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { getSingleMapDetailsAPI } from "@/services/maps";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddMapDrawer from "./AddMapDrawer";
import styles from "./google-map.module.css";

const AddPolygon = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [mapDetails, setMapDetails] = useState<any>({});
  const [addMapDrawerOpen, setAddMapDrawerOpen] = useState<any>(true);

  const OtherMapOptions = (map: any, maps: any) => {
    setMap(map);
    setGoogleMaps(maps);
  };

  const getSingleMapDetails = async () => {
    try {
      const response = await getSingleMapDetailsAPI(id);
      if (response?.status == 200 || response?.status == 201) {
        setMapDetails(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  useEffect(() => {
    if (id) {
      getSingleMapDetails();
    }
  }, []);

  return (
    <div className={styles.markersPageWeb}>
      <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
        <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
      </div>
      <AddMapDrawer
        mapDetails={mapDetails}
        setMapDetails={setMapDetails}
        addMapDrawerOpen={addMapDrawerOpen}
        setAddMapDrawerOpen={setAddMapDrawerOpen}
        getSingleMapDetails={getSingleMapDetails}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default AddPolygon;
