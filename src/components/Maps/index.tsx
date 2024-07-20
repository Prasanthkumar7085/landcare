"use client"
import { getAllListMapsAPI } from "@/services/maps";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

const Maps = () => {

    const [mapsData, setMapsData] = useState<any[]>([]);
    const [paginationDetails, setPaginationDetails] = useState({});
    console.log(mapsData);
    console.log(paginationDetails);

    const getAllMaps = async () => {
        try {
            const response = await getAllListMapsAPI();
            // const { data, ...rest } = response;
            setMapsData(response?.record);
            // setPaginationDetails(rest);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getAllMaps();
    }, [])

    return (
        <div>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Grid container spacing={2}>
                    {mapsData?.map((item: any, index: any) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <img
                                        alt=""
                                        src="/map-location.png"
                                        style={{ width: '100%', height: 'auto', marginBottom: 10 }}
                                    />
                                    <Typography variant="body2" component="div" gutterBottom>
                                        {item?.title || "--"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item?.description || "--"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(item?.created_at).toLocaleString() || "--"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Toaster richColors closeButton position="top-right" />
        </div>
    );
}
export default Maps;
