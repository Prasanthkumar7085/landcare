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
            <Typography className="markerTitle">
              {item?.title || "---"}
            </Typography>
          )}
        
      </AccordionSummary>
      <AccordionDetails>
       
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
       
        <Typography className="markerLocation">
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
            <Typography className=" tagValue">
              <Image
                src="/map/view/tag-view.svg"
                alt=""
                width={18}
                height={18}
              />

              {item?.tags?.length > 0 ?
                item?.tags.map((tag: any, index: number) => {
                  return (
                    <span className="tagText" key={index}>
                      {tag}
                    </span>
                  )
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
              }}
            >
              <Image
                width={18}
                height={18}
                style={{
                  display: item?.organisation_type ? "" : "none",
                }}
                src={
                  // item?.organisation_type
                  //   ? markersImagesWithOrganizationType[
                  //   item?.organisation_type
                  //   ]
                  //   :
                  "/map/view/group-view.svg"
                }
                alt={item?.organisation_type}
              />
              <span>

                {item?.organisation_type || "---"}
              </span>
            </Typography>
          )}
      
          
      
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : item?.website ? (
            <Tooltip
              title={
                item?.website && item?.website?.length > 40 ? item?.website : ""
              }
            >
              <Link
                href={item?.website}
                target="_blank"
                className="value"
              >
                <Image
                  src="/map/view/website-view.svg"
                  alt=""
                  width={18}
                  height={18}
                />
                <span>

                  {truncateText(item?.website, 40) || "---"}
                </span>
              </Link>
            </Tooltip>
          ) : (
            "---"
          )}
       
        

        

        <Typography className="value" style={{ marginTop: "0.5rem" }}>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <span className="value">
              <Image
                src="/map/view/mobile-view.svg"
                alt=""
                width={18}
                height={18}
              />
              <span>

                {item?.contact || "---"}
              </span>
            </span>
          )}
        </Typography>

        <Typography className="value">
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <span className="value">
              <Image
                src="/map/view/fax-view.svg"
                alt=""
                width={18}
                height={18}
              />
              <span>
                {item?.fax || "---"}</span>
            </span>

          )}
        </Typography>

        

       
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="value">
              <Image
                src="/map/view/postal-view.svg"
                alt=""
                width={18}
                height={18}
              />
              <span>

                {item?.postcode || "---"}{" "}
              </span>
            </Typography>
          )}
      
        
       
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography
              className="value"
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
            <Typography className="value">
              <Image
                src="/map/view/mobile-view.svg"
                alt=""
                width={18}
                height={18}
              />
              <span>{item?.phone || "---"} </span>
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
