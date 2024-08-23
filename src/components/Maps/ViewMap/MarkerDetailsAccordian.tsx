import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import { truncateText } from "@/lib/helpers/nameFormate";
import Link from "next/link";

const MarkerDetailsAccordian = ({
  singleMarkerLoading,
  item,
  index,
  markersImagesWithOrganizationType,
  markersRef,
  handleMarkerClick,
  setShareDialogOpen,
}: any) => {
  return (
    <Accordion key={index}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="headerDetails">
          {singleMarkerLoading ? (
            <Skeleton width="60%" className="markerTitle" />
          ) : (
            <Typography className="markerTitle">
              {item?.title || "---"}
            </Typography>
          )}
          <Typography className="markerLocation">
            <Image src="/map/location-blue.svg" alt="" width={10} height={10} />
            {singleMarkerLoading ? (
              <Skeleton width="60%" />
            ) : (
              <span>{item?.town?.split(" ")[0] || "---"}</span>
            )}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="eachMarkerDetail">
          <Typography className="title">Description</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Tooltip
              title={
                item?.description && item?.description?.length >= 200
                  ? item?.description
                  : ""
              }
            >
              <Typography className="value">
                {truncateText(item?.description, 200) || "---"}
              </Typography>
            </Tooltip>
          )}
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Tags</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="value">
              {item?.tags?.join(", ") || "---"}
            </Typography>
          )}
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Organization Type</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography
              className="value"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                textTransform: "capitalize",
              }}
            >
              <img
                width={15}
                height={15}
                style={{
                  display: item?.organisation_type ? "" : "none",
                }}
                src={
                  item?.organisation_type
                    ? markersImagesWithOrganizationType[item?.organisation_type]
                    : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
                }
                alt={item?.organisation_type}
              />
              {item?.organisation_type || "---"}
            </Typography>
          )}
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Website</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : item?.website ? (
            <Tooltip
              title={
                item?.website && item?.website?.length > 40 ? item?.website : ""
              }
            >
              <Link href={item?.website} target="_blank" className="value">
                {truncateText(item?.website, 40) || "---"}
              </Link>
            </Tooltip>
          ) : (
            "---"
          )}
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Contact</Typography>
          <Typography className="value">
            {singleMarkerLoading ? (
              <Skeleton width="60%" />
            ) : (
              item?.contact || "---"
            )}
          </Typography>
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Postcode</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="value">
              {item?.postcode || "---"}{" "}
            </Typography>
          )}
        </div>
        <div className="headerDetails">
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography
              className="footerText"
              style={{ marginBottom: "0.3rem" }}
            >
              <Image src="/map/email.svg" alt="" width={12} height={12} />
              <span>{item?.email || "---"} </span>
            </Typography>
          )}
          {singleMarkerLoading ? (
            <Skeleton width="30%" />
          ) : (
            <Typography className="footerText">
              <Image src="/map/cell-icon.svg" alt="" width={12} height={12} />
              <span>{item?.phone || "---"} </span>
            </Typography>
          )}
        </div>
        <div className="btnGrp">
          <Button
            className="navigateBtn"
            variant="contained"
            endIcon={
              <Image src="/map/navigate.svg" alt="" width={15} height={15} />
            }
            onClick={() => {
              const markerEntry = markersRef.current.find(
                (entry: any) => entry.id === item?.id
              );
              if (markerEntry) {
                const { marker } = markerEntry;
                handleMarkerClick(item, marker);
              } else {
                console.error(`Marker with ID  not found.`);
              }
            }}
          >
            {item ? "Navigate" : <Skeleton width="100%" />}
          </Button>
          <IconButton
            className="iconBtn"
            onClick={() => {
              setShareDialogOpen(true);
            }}
          >
            {item ? (
              <Image src="/map/share-white.svg" alt="" width={13} height={13} />
            ) : (
              <Skeleton variant="circular" width={13} height={13} />
            )}
          </IconButton>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
export default MarkerDetailsAccordian;
