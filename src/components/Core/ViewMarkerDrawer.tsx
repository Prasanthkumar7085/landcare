import { datePipe } from '@/lib/helpers/datePipe';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

const ViewMarkerDrawer = ({ data, setData, onClose }: any) => {

    return (
        <div
        >
            <Box sx={{ width: 300, p: 2 }}>
                <IconButton
                    onClick={() => {
                        onClose(false);
                        setData({});
                    }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ height: 150, backgroundColor: '#f0f4f3', mt: 1, borderRadius: 1 }}></Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    {data ? data?.title : <Skeleton width="60%" />}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon sx={{ fontSize: 14 }} /> {data ? data.type : <Skeleton width="40%" />}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {data ? data?.description : <Skeleton width="100%" />}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2">
                        {data ? data?.coordinates?.join(", ") : <Skeleton width="80%" />}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2">
                        {data ? datePipe(data?.created_at) : <Skeleton width="50%" />}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" color="success" sx={{ flexGrow: 1, mr: 1 }}>
                        {data ? "Navigate" : <Skeleton width="100%" />}
                    </Button>
                    <IconButton color="primary">
                        {data ? <ShareIcon /> : <Skeleton variant="circular" width={40} height={40} />}
                    </IconButton>
                </Box>
            </Box>
        </div>
    );
}

export default ViewMarkerDrawer;
