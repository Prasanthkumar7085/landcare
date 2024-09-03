import { navigateToMarker } from "@/lib/helpers/mapsHelpers";
import { truncateText } from "@/lib/helpers/nameFormate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const MarkerDetailsAccordian = ({
  singleMarkerLoading,
  item,
  index,
  markersImagesWithOrganizationType,
  markersRef,
  handleMarkerClick,
  map,
}: any) => {
  return (
    <Accordion key={index}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {singleMarkerLoading ? (
          <Skeleton width="60%" className="markerTitle" />
        ) : (
          <Typography className="markerTitle">{item?.name || "---"}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {singleMarkerLoading ? (
          <Skeleton width="60%" />
        ) : (
          <Typography
            className="value"
            sx={{ display: item?.description ? "" : "none !important" }}
          >
            {item?.description || "---"}
          </Typography>
        )}

        <Typography
          className="markerLocation"
          sx={{ display: item?.town ? "" : "none !important" }}
        >
          <Image
            src="/map/view/location-view.svg"
            alt=""
            width={18}
            height={18}
          />
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <span>{item?.town?.split(" ")[0] || "---"}</span>
          )}
        </Typography>

        {singleMarkerLoading ? (
          <Skeleton width="60%" />
        ) : (
          <Typography
            className=" tagValue"
            sx={{ display: item?.tags?.length > 0 ? "" : "none !important" }}
          >
            <Image src="/map/view/tag-view.svg" alt="" width={18} height={18} />

            {item?.tags?.length > 0
              ? item?.tags.map((tag: any, index: number) => {
                  return (
                    <span className="tagText" key={index}>
                      {tag}
                    </span>
                  );
                })
              : "---"}
          </Typography>
        )}

        {singleMarkerLoading ? (
          <Skeleton width="60%" />
        ) : (
          <Typography
            className="value"
            sx={{
              textTransform: "capitalize",
              display: item?.type ? "" : "none !important",
            }}
          >
            <img
              width={18}
              height={18}
              style={{
                display: item?.type ? "" : "none",
              }}
              src={
                item?.type ? markersImagesWithOrganizationType[item?.type] : ""
              }
              alt={item?.type}
            />
            <span>{item?.type || "---"}</span>
          </Typography>
        )}

        {singleMarkerLoading ? (
          <Skeleton width="60%" />
        ) : item?.website ? (
          <Link href={item?.website} target="_blank" className="value">
            <Image
              src="/map/view/website-view.svg"
              alt=""
              width={18}
              height={18}
            />
            <span>{item?.website || "---"}</span>
          </Link>
        ) : (
          ""
        )}

        <Typography
          className="value"
          style={{ display: item?.contact ? "" : "none !important" }}
        >
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <span
              className="value"
              style={{ display: item?.contact ? "" : "none" }}
            >
              <Image
                src="/map/view/group-view.svg"
                alt=""
                width={18}
                height={18}
              />
              <span>{item?.contact || "---"}</span>
            </span>
          )}
        </Typography>
        {singleMarkerLoading ? (
          <Skeleton width="60%" />
        ) : (
          <Typography
            className="value"
            sx={{ display: item?.postcode ? "" : "none !important" }}
          >
            <Image
              src="/map/view/postal-view.svg"
              alt=""
              width={18}
              height={18}
            />
            <span>{item?.postcode || "---"} </span>
          </Typography>
        )}

        {singleMarkerLoading ? (
          <Skeleton width="60%" />
        ) : (
          <Typography
            className="value"
            sx={{ display: item?.email ? "" : "none !important" }}
          >
            <Image
              src="/map/view/email-view.svg"
              alt=""
              width={18}
              height={18}
            />
            <span>{item?.email || "---"} </span>
          </Typography>
        )}

        {singleMarkerLoading ? (
          <Skeleton width="30%" />
        ) : (
          <Typography
            className="value"
            sx={{ display: item?.phone_number ? "" : "none !important" }}
          >
            <Image
              src="/map/view/mobile-view.svg"
              alt=""
              width={18}
              height={18}
            />
            <span>{item?.phone_number || "---"} </span>
          </Typography>
        )}

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
                navigateToMarker(map, item?.id, [item]);
                handleMarkerClick(item, marker);
              } else {
                console.error(`Marker with ID  not found.`);
              }
            }}
          >
            {item ? "Navigate" : <Skeleton width="100%" />}
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
export default MarkerDetailsAccordian;
