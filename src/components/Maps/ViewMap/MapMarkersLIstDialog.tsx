import TablePaginationComponent from "@/components/Core/TablePaginationComponent";
import TanstackTableComponent from "@/components/Core/TanstackTableComponent";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { deleteMarkerAPI, getAllMapMarkersAPI } from "@/services/maps";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mapTypeOptions } from "@/lib/constants/mapConstants";
import { toast, Toaster } from "sonner";
import DeleteDialog from "@/components/Core/DeleteDialog";
import LoadingComponent from "@/components/Core/LoadingComponent";
import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import { ListMarkersColumns } from "./ListMarkersColumns";
import Image from "next/image";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const MapMarkersListDialog = ({ open, handleClose }: any) => {
  const { id } = useParams();

  const [markers, setMarkers] = useState<any[]>([]);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [search, setSearch] = useState("");
  const [selectType, setSelectType] = useState<any>();
  const [markerId, setMarkerId] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleClickDeleteOpen = (id: any) => {
    setDeleteOpen(true);
    setMarkerId(id);
  };
  const handleDeleteCose = () => {
    setDeleteOpen(false);
  };

  const getAllMapMarkers = async ({
    page = 1,
    limit = 8,
    search_string = search,
    type = selectType?.title,
  }) => {
    setShowLoading(true);
    try {
      let queryParams: any = {
        search_string: search_string ? search_string : "",
        page: page,
        limit: limit,
        type: type ? type : "",
      };
      const response = await getAllMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      setMarkers(data);
      setPaginationDetails(rest);
    } catch (err) {
      console.error(err);
    } finally {
      setShowLoading(false);
    }
  };

  const deleteMarker = async () => {
    setLoading(true);
    try {
      const response = await deleteMarkerAPI(id, markerId);
      toast.success(response?.message);
      getAllMapMarkers({});
      handleDeleteCose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMapMarkers({
      page: 1,
      limit: 8,
      search_string: search,
      type: selectType?.title,
    });
  }, [search, selectType?.title]);

  const columns = [
    {
      accessorFn: (row: any) => row,
      sortDescFirst: false,
      id: "actions",
      cell: (info: any) => (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Image src="/map/table/view.svg" alt="" width={15} height={15} />
          <Image src="/map/table/share.svg" alt="" width={15} height={15} />
          <Image src="/map/table/copy.svg" alt="" width={15} height={15} />
          <IconButton
            className="iconBtn"
            onClick={() => {
              handleClickDeleteOpen(info?.row?.original?.id);
            }}
          >
            <Image src="/map/table/trash.svg" alt="" width={15} height={15} />
          </IconButton>
        </div>
      ),
      header: () => <span>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "110px",
    },
  ];

  const capturePageNum = (value: number) => {
    getAllMapMarkers({
      limit: 10,
      page: value,
    });
  };

  const captureRowPerItems = (value: number) => {
    getAllMapMarkers({
      limit: value,
      page: 1,
    });
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      className="showAllMarkerDialog"
      sx={{
        background: "#0000008f",
        zIndex: 1000,
        "& .MuiPaper-root": {
          margin: "0 auto!important",
          maxWidth: "90% !important",
          maxHeight: "600px",
          borderRadius: "10px",
        },
      }}
    >
      <div className="dialogHeader">
        <div className="dialogTitle">
          <Image src="/map/map-orangebg.svg" alt="" width={30} height={30} />
          <span> All Markers</span>
        </div>
        <div className="filterGrp">
          <TextField
            className="defaultTextFeild"
            variant="outlined"
            size="small"
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* <AutoCompleteSearch
                        data={mapTypeOptions}
                        setSelectValue={setSelectType}
                        selectedValue={selectType}
                        placeholder="Select Marker Type"
                    /> */}
          <IconButton
            className="iconBtn"
            aria-label="close"
            onClick={handleClose}
          >
            <Image
              src="/map/close-with-border.svg"
              alt=""
              width={30}
              height={30}
            />
          </IconButton>
        </div>
      </div>

      <div>
        <TanstackTableComponent
          data={markers}
          columns={[...ListMarkersColumns, ...columns]}
          loading={false}
        />
        {markers?.length ? (
          <TablePaginationComponent
            paginationDetails={paginationDetails}
            capturePageNum={capturePageNum}
            captureRowPerItems={captureRowPerItems}
            values="Markers"
          />
        ) : (
          ""
        )}
      </div>
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleDeleteCose={handleDeleteCose}
        deleteFunction={deleteMarker}
        lable="Delete Marker"
        text="Are you sure want to delete marker?"
        loading={loading}
      />
      <LoadingComponent loading={showLoading} />
      <Toaster richColors closeButton position="top-right" />
    </BootstrapDialog>
  );
};
export default MapMarkersListDialog;
