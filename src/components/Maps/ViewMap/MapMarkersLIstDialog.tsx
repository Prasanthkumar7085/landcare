import TablePaginationComponent from '@/components/Core/TablePaginationComponent';
import TanstackTableComponent from '@/components/Core/TanstackTableComponent';
import { datePipe } from '@/lib/helpers/datePipe';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Dialog from '@mui/material/Dialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { deleteMarkerAPI, getAllMapMarkersAPI } from '@/services/maps';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mapTypeOptions } from '@/lib/constants/mapConstants';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, Toaster } from 'sonner';
import DeleteDialog from '@/components/Core/DeleteDialog';
import LoadingComponent from '@/components/Core/LoadingComponent';
import AutoCompleteSearch from '@/components/Core/AutoCompleteSearch';
import { ListMarkersColumns } from './ListMarkersColumns';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
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
        type = selectType?.title
    }) => {
        setShowLoading(true);
        try {
            let queryParams: any = {
                search_string: search_string ? search_string : "",
                page: page,
                limit: limit,
                type: type ? type : ""
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
            getAllMapMarkers({})
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
            type: selectType?.title
        });
    }, [search, selectType?.title]);

    const columns = [
        {
            accessorFn: (row: any) => row,
            sortDescFirst: false,
            id: "actions",
            cell: (info: any) => (
                <div style={{ display: 'flex', gap: "1.5rem" }}>
                    <VisibilityIcon />
                    <ShareIcon />
                    <FileCopyIcon />
                    <IconButton
                        onClick={() => {
                            handleClickDeleteOpen(info?.row?.original?.id)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
            header: () => <span>ACTIONS</span>,
            footer: (props: any) => props.column.id,
            width: "150px",
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
            sx={{
                background: "#0000008f",
                zIndex: 1000,
                "& .MuiPaper-root": {
                    margin: "0 !important",
                    // width: "100%",
                    // height: "calc(100% - 10px)",
                    maxWidth: "75% !important",
                    maxHeight: "600px",
                },
                // "& .MuiTypography-root": {
                //     color: "#fff",
                // },
            }}
        >
            <DialogTitle>
                All Markers
            </DialogTitle>
            <TextField
                variant="outlined"
                size='small'
                type='search'
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
            <AutoCompleteSearch
                data={mapTypeOptions}
                setSelectValue={setSelectType}
                selectedValue={selectType}
                placeholder="Select Marker Type"
            />
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
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
            </DialogContent>
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
}
export default MapMarkersListDialog;