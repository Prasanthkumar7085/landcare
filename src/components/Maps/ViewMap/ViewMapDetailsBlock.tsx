import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import DeleteDialog from "@/components/Core/DeleteDialog";
import {
  deleteAllMarkersAPI,
  deleteMapAPI,
  getStaticMapAPI,
  updateMapWithCordinatesAPI,
} from "@/services/maps";
import MapMarkersList from "./MapMarkersList";
import ImportModal from "./ImportMarkers/ImportModal";
import {
  getPolygonWithMarkers,
  updateMapWithCordinatesHelper,
} from "@/lib/helpers/mapsHelpers";
import { truncateText } from "@/lib/helpers/nameFormate";
import AddMapDrawer from "../AddMap/AddMapDrawer";
import { datePipe } from "@/lib/helpers/datePipe";

const ViewMapDetailsDrawer = ({
  mapDetails,
  singleMarkers,
  setSearchString,
  searchString,
  setSingleMarkerOpen,
  setMarkerOption,
  markerOption,
  getData,
  map,
  maps,
  markersRef,
  handleMarkerClick,
  getSingleMapMarkers,
  markersImagesWithOrganizationType,
  setPolygonCoords,
  setMapDetails,
  selectedOrginazation,
  setSelectedOrginazation,
  getSingleMapMarkersForOrginazations,
  allMarkers,
}: any) => {
  const router = useRouter();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [file, setFile] = useState<File | any>(null);
  const open = Boolean(anchorEl);
  const [showModal, setShowModal] = useState<any>(false);
  const [addMapDrawerOpen, setAddMapDrawerOpen] = useState<any>(false);
  const [deleteAllMarkersOpen, setDeleteAllMarkersOpen] = useState<any>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteCose = () => {
    setDeleteOpen(false);
  };

  const deleteMap = async () => {
    setLoading(true);
    try {
      const response = await deleteMapAPI(id);
      toast.success(response?.message);
      router.push("/maps");
      handleDeleteCose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllMarkers = async () => {
    setLoading(true);
    try {
      const response = await deleteAllMarkersAPI(id);
      toast.success(response?.message);
      handleDeleteCose();
      await updateMapWithCordinatesHelper({
        deleteall: true,
        allMarkers: allMarkers,
        mapDetails: mapDetails,
        id: id,
      });
      await getData({ get_all: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFile(null);
  };

  return (
    <div className="mapViewContainer">
      <header className="header">
        <Button
          className="backBtn"
          startIcon={
            <Image src="/map/map-backBtn.svg" alt="" height={15} width={15} />
          }
          onClick={() => router.push("/maps")}
        >
          Back
        </Button>
        <div className="actionGrp">
          <Button onClick={openModal} className="importBtn">
            Import
          </Button>

          <IconButton className="iconBtn" onClick={handleClick}>
            <Image src="/map/menu-with-bg.svg" alt="" height={28} width={28} />
          </IconButton>
        </div>
      </header>
      <div className="viewContent">
        <div className="mapDetails">
          <Typography className="mapTitle">
            {mapDetails?.title ? mapDetails?.title : "--"}
          </Typography>

          <Typography className="mapCreated">
            <Image src="/map/clock.svg" height={13} width={13} alt="" />
            {datePipe(mapDetails?.created_at)}
          </Typography>
          <Tooltip
            title={
              mapDetails?.description && mapDetails?.description?.length > 70
                ? mapDetails?.description
                : ""
            }
          >
            <Typography className="mapDescription">
              {truncateText(mapDetails?.description, 70) || "---"}
            </Typography>
          </Tooltip>
        </div>
        <div className="markersBlock">
          <Typography className="blockHeading">Markers</Typography>
          <div className="markersContainer">
            <MapMarkersList
              singleMarkers={singleMarkers}
              setSearchString={setSearchString}
              searchString={searchString}
              setSingleMarkerOpen={setSingleMarkerOpen}
              setMarkerOption={setMarkerOption}
              markerOption={markerOption}
              map={map}
              maps={maps}
              markersRef={markersRef}
              handleMarkerClick={handleMarkerClick}
              getSingleMapMarkers={getSingleMapMarkers}
              markersImagesWithOrganizationType={
                markersImagesWithOrganizationType
              }
              mapDetails={mapDetails}
              selectedOrginazation={selectedOrginazation}
              setSelectedOrginazation={setSelectedOrginazation}
              getData={getData}
            />
          </div>
        </div>
      </div>
      <Menu
        sx={{ mt: 1 }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          className="menuItem"
          onClick={() => {
            handleClose();
            setAddMapDrawerOpen(true);
          }}
        >
          Edit map
        </MenuItem>
        <MenuItem
          className="menuItem"
          onClick={() => {
            handleClickDeleteOpen();
            handleClose();
          }}
        >
          Delete map
        </MenuItem>
        <MenuItem
          className="menuItem"
          disabled={singleMarkers?.length === 0}
          onClick={() => {
            setDeleteAllMarkersOpen(true);
            handleClickDeleteOpen();
            handleClose();
          }}
        >
          Clear all Markers
        </MenuItem>
      </Menu>
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleDeleteCose={handleDeleteCose}
        deleteFunction={deleteMap}
        lable="Delete Map"
        text="Are you sure want to delete map?"
        loading={loading}
      />
      <DeleteDialog
        deleteOpen={deleteOpen && deleteAllMarkersOpen}
        handleDeleteCose={handleDeleteCose}
        deleteFunction={deleteAllMarkers}
        lable="Delete markers"
        text="Are you sure want to delete all markers?"
        loading={loading}
      />
      {showModal ? (
        <ImportModal
          show={showModal}
          onClose={closeModal}
          file={file}
          setFile={setFile}
          getData={getData}
          mapDetails={mapDetails}
          setPolygonCoords={setPolygonCoords}
          getSingleMapMarkersForOrginazations={
            getSingleMapMarkersForOrginazations
          }
        />
      ) : (
        ""
      )}
      <AddMapDrawer
        mapDetails={mapDetails}
        setMapDetails={setMapDetails}
        addMapDrawerOpen={addMapDrawerOpen}
        setAddMapDrawerOpen={setAddMapDrawerOpen}
        getSingleMapDetails={getData}
      />
    </div>
  );
};
export default ViewMapDetailsDrawer;
