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

const ViewMapDetailsDrawer = ({
  mapDetails,
  markers,
  paginationDetails,
  getData,
  setSearch,
  search,
  singleMarkers,
  setSearchString,
  searchString,
  setSingleMarkerOpen,
  singleMarkeropen,
  setMarkerData,
  markerData,
  setMarkerOption,
  markerOption,
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
          <ImportModal
            show={showModal}
            onClose={closeModal}
            file={file}
            setFile={setFile}
            getData={getData}
          />
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
            {dayjs(mapDetails?.created_at).format("MM-DD-YYYY")}
          </Typography>
          <Typography className="mapDescription">
            {mapDetails?.description ? mapDetails?.description.slice() : "--"}
          </Typography>
        </div>
        <div className="markersBlock">
          <Typography className="blockHeading">Markers</Typography>
          <div className="markersContainer">
            {markers?.length > 0 || singleMarkers?.length > 0 ? (
              <MapMarkersList
                markers={markers}
                paginationDetails={paginationDetails}
                getData={getData}
                setSearch={setSearch}
                search={search}
                singleMarkers={singleMarkers}
                setSearchString={setSearchString}
                searchString={searchString}
                setSingleMarkerOpen={setSingleMarkerOpen}
                singleMarkeropen={singleMarkeropen}
                setMarkerData={setMarkerData}
                markerData={markerData}
                setMarkerOption={setMarkerOption}
                markerOption={markerOption}
              />
            ) : (
              <div className="nodataGrp">
                <Image
                  src={"/no-markers.svg"}
                  width={180}
                  height={180}
                  alt="no data"
                />
                <Typography className="nodataTxt">
                  No markers added yet. Start placing markers on your map.
                </Typography>
              </div>
            )}
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
    </div>
  );
};
export default ViewMapDetailsDrawer;
