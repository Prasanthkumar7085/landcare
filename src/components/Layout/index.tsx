import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Cookies from "js-cookie";
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserDetails } from '@/redux/Modules/userlogin';
import { Menu, MenuItem } from '@mui/material';

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

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

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
            <AppBar position='sticky' sx={{ backgroundColor: 'white', top: "0" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Image
                            alt=""
                            src="/group .svg"
                            height={60}
                            width={70}
                        />
                        <Image
                            alt=""
                            src="/Vector.svg"
                            height={60}
                            width={70}
                        />

                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <p style={{
                                color: pathname === "/maps" ? 'red' : 'black',
                                fontWeight: pathname === "/maps" ? 'bold' : 'normal',
                                cursor: 'pointer'
                            }} onClick={() => router.push('/maps')}>
                                Maps
                            </p>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: "orange" }}>
                                    {userDetails?.name?.slice(0, 1).toUpperCase()}
                                </Avatar>

                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem className="menuItem" onClick={logout}>
                                    Log Out
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <div>
                {children}
            </div>
        </>
    );
}
export default Navbar;
