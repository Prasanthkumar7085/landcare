import { Button, Menu, MenuItem, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import DeleteDialog from "@/components/Core/DeleteDialog";
import { deleteMapAPI } from "@/services/maps";
import MapMarkersList from "./MapMarkersList";
import styles from "./view-map-block.module.css";
import ImportModal from "./ImportModal";

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
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <Button onClick={() => router.push("/maps")}>Back</Button>
          <div>
            <Button onClick={openModal}>Import</Button>
            <ImportModal
              show={showModal}
              onClose={closeModal}
              file={file}
              setFile={setFile}
            />
            <Button onClick={handleClick}>...</Button>
          </div>
        </div>
        <h2 className={styles.heading}>Map Details</h2>

        <div className={styles.actionsbar}></div>
      </header>
      <div id={styles.listview} className="scrollbar">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">
            {mapDetails?.title ? mapDetails?.title : "--"}
          </Typography>
          <Typography variant="caption">
            {dayjs(mapDetails?.created_at).format("MM-DD-YYYY")}
          </Typography>
          <Typography variant="caption">
            {mapDetails?.description ? mapDetails?.description : "--"}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" className={styles.title}>
            Markers
          </Typography>
        </div>
        {markers?.length > 0 || singleMarkers?.length > 0 ? (
          <div>
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
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Image
              src={"/no-markers.svg"}
              width={120}
              height={120}
              alt="no data"
            />
            <Typography variant="caption">
              No markers added yet.{""}
              Start placing markers on your map.
            </Typography>
          </div>
        )}
      </div>
      <div className={styles.buttoncontainer}></div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => router.push(`/update-map/${id}`)}>
          Edit
        </MenuItem>
        <MenuItem
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
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default ViewMapDetailsDrawer;
