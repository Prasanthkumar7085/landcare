import type { NextPage } from "next";
import { Button, Icon } from "@mui/material";
import styles from "./index.module.css";


const MarkerList = () => {
  return (
    <div className={styles.markergroup}>
      <div className={styles.mapsection}>
        <div className={styles.topnav}>
          <Button
            className={styles.backbutton}
            disableElevation
            color="primary"
            variant="contained"
            startIcon={<Icon>arrow_back_ios_sharp</Icon>}
            sx={{ borderRadius: "0px 0px 0px 0px" }}
          >
            Back
          </Button>
          <div className={styles.inputgroup}>
            <Button
              disableElevation
              color="success"
              variant="contained"
              sx={{ borderRadius: "0px 0px 0px 0px" }}
            >
              Import
            </Button>
            <div className={styles.more}>
              <img
                className={styles.pencilSimpleLine1Icon}
                alt=""
                src="/pencilsimpleline-1.svg"
              />
              <img
                className={styles.dotsThreeOutlineIcon}
                alt=""
                src="/dotsthreeoutline.svg"
              />
            </div>
          </div>
        </div>
        <div className={styles.mapdetails}>
          <div className={styles.mapname}>
            <h3 className={styles.mapName}>Map Name</h3>
            <div className={styles.datetime}>
              <img className={styles.clock1Icon} alt="" src="/clock-1.svg" />
              <p className={styles.filter}>July 2, 2024 3:45 PM</p>
            </div>
          </div>
          <p className={styles.paragraph}>
            Maps allow you to visualize and manage your locations efficiently.
            Add new maps to mark areas, pin important locations, and keep track
            of your data all in one place.
          </p>
        </div>
      </div>
      <div className={styles.markersection}>
        <div className={styles.mapdetails}>
          <div className={styles.markertop}>
            <h3 className={styles.title}>Markers</h3>
            <div className={styles.searchsection}>
              <div className={styles.inputsearch}>
                <img
                  className={styles.searchicon}
                  alt=""
                  src="/searchicon.svg"
                />
                <p className={styles.search}>{`Search `}</p>
              </div>
              <div className={styles.inputfilter}>
                <img
                  className={styles.filtericon}
                  alt=""
                  src="/filtericon.svg"
                />
                <p className={styles.filter}>Filter</p>
              </div>
              <div className={styles.more1}>
                <img
                  className={styles.dotsThreeOutlineIcon}
                  alt=""
                  src="/moreicon.svg"
                />
              </div>
            </div>
          </div>
          <div className={styles.markerlocation}>
            <div className={styles.locationcard}>
              <div className={styles.locationprofile}>
                <div className={styles.locationname}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="/avatar@2x.png"
                  />
                  <h3 className={styles.locationtitle}>Stewart Hospital</h3>
                </div>
                <div className={styles.markerlocation1}>
                  <img
                    className={styles.clock1Icon}
                    alt=""
                    src="/locationicon.svg"
                  />
                  <p className={styles.filter}>Hospitals</p>
                </div>
              </div>
              <p className={styles.paragraph1}>
                Hospitals provide essential medical care and emergency services.
                They are equipped with specialized staff and facilit
              </p>
              <div className={styles.longitudegroup}>
                <div className={styles.longitudediv}>
                  <img
                    className={styles.clock1Icon}
                    alt=""
                    src="/locationicon1.svg"
                  />
                  <p className={styles.filter}>39.92633, 64. 46094</p>
                </div>
                <div className={styles.datetime1}>
                  <img className={styles.timeicon} alt="" src="/timeicon.svg" />
                  <p className={styles.filter}>July 2, 2024 3:45 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.markerlocation}>
            <div className={styles.locationcard}>
              <div className={styles.locationprofile}>
                <div className={styles.locationname}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="/avatar@2x.png"
                  />
                  <h3 className={styles.locationtitle}>Havmore Restaurent</h3>
                </div>
                <div className={styles.markerlocation3}>
                  <img
                    className={styles.clock1Icon}
                    alt=""
                    src="/locationicon2.svg"
                  />
                  <p className={styles.filter}>Restaurants</p>
                </div>
              </div>
              <p className={styles.paragraph1}>
                Establishment where refreshments or meals may be procured by the
                public. The public dining room that ultimately came to be known
                as the restaurant originated in
                <a
                  className={styles.france}
                  href="https://www.britannica.com/place/France"
                  target="_blank"
                >
                  <span className={styles.france1}>France</span>
                </a>
                , and the French have continued to make major contributions to
                the restaurant’s development.
              </p>
              <div className={styles.longitudegroup}>
                <div className={styles.longitudediv1}>
                  <img
                    className={styles.clock1Icon}
                    alt=""
                    src="/locationicon1.svg"
                  />
                  <p className={styles.filter}>39.92633, 64. 46094</p>
                </div>
                <div className={styles.datetime1}>
                  <img className={styles.timeicon} alt="" src="/timeicon.svg" />
                  <p className={styles.filter}>July 2, 2024 3:45 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.markerlocation}>
            <div className={styles.locationcard}>
              <div className={styles.locationprofile}>
                <div className={styles.locationname}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="/avatar@2x.png"
                  />
                  <div className={styles.mvpMall}>MVP Mall</div>
                </div>
                <div className={styles.markerlocation5}>
                  <img
                    className={styles.clock1Icon}
                    alt=""
                    src="/locationicon3.svg"
                  />
                  <p className={styles.filter}>Shopping Centers</p>
                </div>
              </div>
              <p className={styles.paragraph1}>
                Hospitals provide essential medical care and emergency services.
                They are equipped with specialized staff and facilities to
                diagnose, treat, and care for patients in need of medical
                attention.
              </p>
              <div className={styles.longitudegroup}>
                <div className={styles.longitudediv}>
                  <img
                    className={styles.clock1Icon}
                    alt=""
                    src="/locationicon1.svg"
                  />
                  <p className={styles.filter}>39.92633, 64. 46094</p>
                </div>
                <div className={styles.datetime1}>
                  <img className={styles.timeicon} alt="" src="/timeicon.svg" />
                  <p className={styles.filter}>July 2, 2024 3:45 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.allmarkersgroup}>
        <div className={styles.inputbutton}>
          <div className={styles.showAllMarkers}>Show All markers</div>
        </div>
      </div>
    </div>
  );
};

export default MarkerList;
