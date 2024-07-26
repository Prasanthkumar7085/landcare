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
import { getAllMapMarkersAPI } from '@/services/maps';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

    const getAllMapMarkers = async ({
        page = 1,
        limit = 8,
        search_string = search,
    }) => {
        try {
            let queryParams: any = {
                search_string: search_string ? search_string : "",
                page: page,
                limit: limit,
            };
            const response = await getAllMapMarkersAPI(id, queryParams);
            const { data, ...rest } = response;
            setMarkers(data);
            setPaginationDetails(rest);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getAllMapMarkers({
            page: 1,
            limit: 8,
            search_string: search,
        });
    }, [search]);

    const columns = [
        {
            accessorFn: (row: any) => row.serial,
            id: "id",
            enableSorting: false,
            header: () => <span>S.No</span>,
            footer: (props: any) => props.column.id,
            width: "60px",
            cell: ({ row, table }: any) =>
                (table
                    .getSortedRowModel()
                    ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
                1,
        },
        {
            accessorFn: (row: any) => row.title,
            id: "title",
            header: () => <span>NAME</span>,
            cell: (info: any) => {
                return <span>{info.getValue() ? info.getValue() : "--"}</span>;
            },
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row.type,
            id: "type",
            sortDescFirst: false,
            cell: (info: any) => (
                <span>{info.getValue() ? info.getValue() : "--"}</span>
            ),
            header: () => <span>CATEGORY</span>,
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row.created_at,
            sortDescFirst: false,
            id: "created_at",
            cell: (info: any) => (
                <span>{datePipe(info.getValue() ? info.getValue() : "--")}</span>
            ),
            header: () => <span>CREATED ON</span>,
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row.coordinates,
            sortDescFirst: false,
            id: "coordinates",
            cell: (info: any) => {
                return (
                    <span>
                        {info.getValue() ? info.getValue().join(", ") : "--"}
                    </span>
                );
            },
            header: () => <span>LATITUDE LONGITUDE</span>,
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row.description,
            sortDescFirst: false,
            id: "description",
            cell: (info: any) => {
                return (
                    <span>
                        {info.getValue() ? info.getValue() : "--"}
                    </span>
                );
            },
            header: () => <span>DESCRIPTION</span>,
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row,
            sortDescFirst: false,
            id: "actions",
            cell: (info: any) => (
                <div style={{ display: 'flex', gap: "1.5rem" }}>
                    <VisibilityIcon />
                    <ShareIcon />
                    <FileCopyIcon />
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
                    columns={columns}
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
        </BootstrapDialog>
    );
}
export default MapMarkersListDialog;