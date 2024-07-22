import { Backdrop, CircularProgress } from "@mui/material";

const LoadingComponent = ({ loading }: { loading: Boolean }) => {

    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={Boolean(loading)}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};
export default LoadingComponent;