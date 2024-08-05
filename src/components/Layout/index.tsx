import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeUserDetails } from "@/redux/Modules/userlogin";
import { Menu, MenuItem } from "@mui/material";
import {
  capitalizeFirstLetter,
  capitalizeFirstTwoWords,
} from "@/lib/helpers/nameFormate";

interface pageProps {
  children: React.ReactNode;
}

const Navbar: React.FC<pageProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const userDetails = useSelector(
    (state: any) => state.auth.user?.data?.user_details
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    Cookies.remove("user");
    dispatch(removeUserDetails());
    router.push("/");
  };

  return (
    <>
      <div className="headnav">
        <div className="navContainer">
          <div className="logoBlock">
            <Image
              alt=""
              src="/login/landcare-logo.svg"
              height={50}
              width={150}
            />
          </div>
          <p
            className={pathname === "/maps" ? "pagetitleActive" : "pageTitle"}
            onClick={() => router.push("/maps")}
          >
            Maps
          </p>
          <div className="profileGrp">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "orange" }}>
                {userDetails?.name?.slice(0, 1).toUpperCase()}
              </Avatar>
            </IconButton>
            <div className="profileName">
              <h4 className="profile">
                {capitalizeFirstTwoWords(userDetails?.name)}
              </h4>
              <p className="designation">
                {userDetails?.user_type
                  ? capitalizeFirstLetter(userDetails.user_type)
                  : ""}
              </p>
            </div>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem className="menuItem" onClick={logout}>
                Log Out
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <div className="baseContainer">{children}</div>
    </>
  );
};
export default Navbar;
