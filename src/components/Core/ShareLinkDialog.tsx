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
import { copyURL } from "@/lib/helpers/copyURL";
import Image from "next/image";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Tooltip } from "@mui/material";

const ShareLinkDialog = ({ open, setShareDialogOpen, mapDetails }: any) => {
  console.log(mapDetails, "Fsdafjjdsjjds");
  const linkToShare = `https://dev-landcare.vercel.app/view-map/${mapDetails?.id}`;

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

  return (
    <Dialog open={open}>
      <DialogTitle>{"Share"}</DialogTitle>
      <DialogContent>
        <div id="shareLinkDialog">
          <div
            style={{
              display: "flex",
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
              onClick={() => copyURL(mapDetails?.id)}
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
