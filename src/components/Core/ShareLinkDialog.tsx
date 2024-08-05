import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import { copyEmbededIframeUrl, copyURL } from "@/lib/helpers/copyURL";
import Image from "next/image";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Tab, Tabs, Tooltip } from "@mui/material";

const ShareLinkDialog = ({
  open,
  setShareDialogOpen,
  mapDetails,
  linkToShare,
}: any) => {
  const linkToEmdeded = `<iframe src=${linkToShare} width="600" height="450" style="border:0;"
       loading="lazy"
       referrerpolicy="no-referrer-when-downgrade"
     ></iframe>`;
  const [tabValue, setTabValue] = React.useState(0);

  const openWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(linkToShare)}`;
    window.open(url, "_blank");
  };

  const openEmail = () => {
    const url = `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(
      linkToShare
    )}`;
    window.open(url, "_blank");
  };

  const openTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      linkToShare
    )}`;
    window.open(url, "_blank");
  };

  const openFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      linkToShare
    )}`;
    window.open(url, "_blank");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{"Share"}</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Share" />
          <Tab label="Copy Embedded URL" />
        </Tabs>
        {tabValue === 0 && (
          <div id="shareLinkDialog">
            <div
              style={{
                display: mapDetails?.title ? "flex" : "none",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
              }}
            >
              <Image
                src={mapDetails?.image ? mapDetails?.image : "/no-image.png"}
                alt="Seetharamalayam"
                width={50}
                height={50}
                style={{ borderRadius: "8px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p>{mapDetails?.title}</p>
                <p>
                  {" "}
                  <Tooltip
                    title={
                      mapDetails?.description?.length >= 50
                        ? mapDetails?.description
                        : ""
                    }
                    placement="bottom"
                  >
                    {mapDetails?.description
                      ? mapDetails?.description?.length >= 50
                        ? `${mapDetails?.description.slice(0, 30)}....`
                        : mapDetails?.description
                      : "--"}
                  </Tooltip>
                </p>
              </div>
            </div>
            <div className="link">
              <TextField
                value={linkToShare}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
              <Button
                onClick={() => copyURL(linkToShare)}
                variant="contained"
                color="primary"
                sx={{ width: "30%" }}
              >
                Copy
              </Button>
            </div>
            <div className="share-icons">
              <IconButton
                className={"icon"}
                aria-label="whatsapp"
                onClick={openWhatsApp}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                className={"icon"}
                aria-label="email"
                onClick={openEmail}
              >
                <EmailIcon />
              </IconButton>
              <IconButton
                className={"icon"}
                aria-label="twitter"
                onClick={openTwitter}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                className={"icon"}
                aria-label="facebook"
                onClick={openFacebook}
              >
                <FacebookIcon />
              </IconButton>
            </div>
          </div>
        )}

        {tabValue === 1 && (
          <div className="copy-url">
            <TextField
              value={linkToEmdeded}
              size="small"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
            <Button
              onClick={() => copyEmbededIframeUrl(linkToEmdeded)}
              variant="contained"
              color="primary"
              sx={{ width: "100%", marginTop: "1rem" }}
            >
              Copy
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShareDialogOpen(false);
          }}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ShareLinkDialog;
