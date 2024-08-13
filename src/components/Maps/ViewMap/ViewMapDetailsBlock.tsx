import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import DeleteDialog from "@/components/Core/DeleteDialog";
import { deleteMapAPI } from "@/services/maps";
import MapMarkersList from "./MapMarkersList";
import ImportModal from "./ImportMarkers/ImportModal";
import { getPolygonWithMarkers } from "@/lib/helpers/mapsHelpers";

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
}: any) => {
  const router = useRouter();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [file, setFile] = useState<File | any>(null);
  const open = Boolean(anchorEl);
  const [showModal, setShowModal] = useState<any>(false);

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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFile(null);
  };
  const coordinates = [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 37.8049, lng: -122.2711 },
    { lat: 37.7749, lng: -122.2711 },
    { lat: 37.8049, lng: -122.4194 },
  ];

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
          <Button onClick={() => getPolygonWithMarkers(coordinates)}>
            Get
          </Button>
          <Typography className="mapCreated">
            <Image src="/map/clock.svg" height={13} width={13} alt="" />
            {dayjs(mapDetails?.created_at).format("MM-DD-YYYY")}
          </Typography>
          <Typography className="mapDescription">
            {mapDetails?.description ? mapDetails?.description.slice() : "--"}
          </Typography>
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
          onClick={() => router.push(`/update-map/${id}`)}
        >
          Edit
        </MenuItem>
        <MenuItem
          className="menuItem"
          onClick={() => {
            handleClickDeleteOpen();
            handleClose();
          }}
        >
          Delete
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
      {showModal ? (
        <ImportModal
          show={showModal}
          onClose={closeModal}
          file={file}
          setFile={setFile}
          getData={getData}
          mapDetails={mapDetails}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default ViewMapDetailsDrawer;
