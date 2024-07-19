import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';

import Image from 'next/image';

interface pageProps {
    children: React.ReactNode;
}

const Navbar: React.FC<pageProps> = ({ children }) => {

    return (
        <AppBar position='fixed' sx={{ backgroundColor: 'white' }}>
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

                    <Box sx={{ flexGrow: 1, display: 'flex', textAlign: 'center', gap: "2rem" }}>
                        <p style={{ color: 'black' }}>
                            Maps
                        </p>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {/* <Tooltip title="Open settings"> */}
                        <IconButton sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
            <div>
                {children}
            </div>
        </AppBar>
    );
}
export default Navbar;