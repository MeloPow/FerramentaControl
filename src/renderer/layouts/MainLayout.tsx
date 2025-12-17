import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    ListItemButton,
    Divider,
    Avatar,
    Tooltip,
    IconButton,
    styled,
    Theme,
    Typography,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ConstructionIcon from '@mui/icons-material/Construction';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BadgeIcon from '@mui/icons-material/Badge';
import MenuIcon from '@mui/icons-material/Menu';

import logoPrincipal from '../../assets/images/logos/logoPrincipalCLEAN.png';
import logoAV from '../../assets/images/logos/logoAV.jpg';
import { text } from 'stream/consumers';

const drawerWidth = 310;

const COLORS = {
    primary: '#F59E0B',
    background: '#0F172A',
    surface: '#111827',
    surfaceLight: '#1F2937',
    text: '#E5E7EB',
    textMuted: '#9CA3AF',
    textPrimary: '#F3F4F6',
};

const APP = {
    tagline: 'Gestão inteligente de ferramentas',
    subline: 'Obras • Depósito • Controle',
} as const;

const CustomAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 2,
    backgroundColor: COLORS.surface,
    height: 100,
    borderBottom: `4px solid ${COLORS.primary}`,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

const CustomDrawer = styled(Drawer)(({ theme }: { theme: Theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        backgroundColor: COLORS.surface,
        color: COLORS.text,
        borderRight: `4px solid ${COLORS.primary}`,
        paddingTop: 20,
    },
}));

const CustomListItem = styled(ListItemButton)(() => ({
    borderRadius: 30,
    margin: '8px 0',
    color: COLORS.text,
    fontWeight: 600,
    '&.Mui-selected': {
        backgroundColor: COLORS.primary,
        color: COLORS.background,
    },
    '&:hover': {
        backgroundColor: COLORS.surfaceLight,
    },
}));

const CustomListItemIcon = styled(ListItemIcon)(() => ({
    minWidth: 40,
    color: 'inherit',
}));

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: COLORS.background, minHeight: '100vh' }}>
            <CssBaseline />

            <CustomAppBar position="fixed" open={open}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => setOpen(!open)} sx={{ color: COLORS.text }}>
                        <MenuIcon fontSize="large" />
                    </IconButton>

                    {/* Bloco institucional */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: COLORS.textMuted,
                                    letterSpacing: 0.8,
                                    textTransform: 'uppercase',
                                    lineHeight: 1,
                                }}
                            >
                                Desenvolvido para
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    color: COLORS.textPrimary,
                                    letterSpacing: 0.5,
                                    lineHeight: 1.1,
                                }}
                            >
                                Atividade Vertical
                            </Typography>
                        </Box>

                        <Avatar
                            src={logoAV}
                            alt="Atividade Vertical"
                            variant="square"
                            sx={{
                                width: 140,
                                height: 130,
                                borderRadius: 4,
                                filter: 'grayscale(100%)',
                                opacity: 0.9,
                            }}
                        />
                    </Box>
                </Toolbar>
            </CustomAppBar>

            <CustomDrawer variant="persistent" anchor="left" open={open}>
                <Toolbar />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 2 }}>
                    <Tooltip title="FerramentasControl">
                        <Avatar
                            src={logoPrincipal}
                            alt="FerramentasControl"
                            sx={{
                                width: 260,
                                height: 280,
                                mb: 1.5,
                            }}
                        />
                    </Tooltip>

                    {/* Linha principal */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            textAlign: 'center',
                            px: 2,
                            fontWeight: 700,
                            letterSpacing: 0.6,
                            color: COLORS.textPrimary,
                            lineHeight: 1.2,
                        }}
                    >
                        {APP.tagline}
                    </Typography>

                    {/* Linha secundária */}
                    <Typography
                        variant="caption"
                        sx={{
                            textAlign: 'center',
                            px: 2,
                            mt: 0.3,
                            fontWeight: 500,
                            letterSpacing: 1,
                            color: COLORS.textMuted,
                            textTransform: 'uppercase',
                        }}
                    >
                        {APP.subline}
                    </Typography>

                    <Divider sx={{ width: '80%', mt: 1.5 }} />
                </Box>


                <List sx={{ px: 2 }}>
                    <CustomListItem selected={location.pathname === '/painel'} onClick={() => handleNavigate('/painel')}>
                        <CustomListItemIcon><DashboardIcon /></CustomListItemIcon>
                        <ListItemText primary="Painel" />
                    </CustomListItem>

                    <CustomListItem selected={location.pathname === '/ferramentas'} onClick={() => handleNavigate('/ferramentas')}>
                        <CustomListItemIcon><ConstructionIcon /></CustomListItemIcon>
                        <ListItemText primary="Ferramentas" />
                    </CustomListItem>

                    <CustomListItem selected={location.pathname === '/movimentacoes'} onClick={() => handleNavigate('/movimentacoes')}>
                        <CustomListItemIcon><SwapHorizIcon /></CustomListItemIcon>
                        <ListItemText primary="Movimentações" />
                    </CustomListItem>

                    <CustomListItem selected={location.pathname === '/obras'} onClick={() => handleNavigate('/obras')}>
                        <CustomListItemIcon><ApartmentIcon /></CustomListItemIcon>
                        <ListItemText primary="Obras" />
                    </CustomListItem>

                    <CustomListItem selected={location.pathname === '/colaboradores'} onClick={() => handleNavigate('/colaboradores')}>
                        <CustomListItemIcon><BadgeIcon /></CustomListItemIcon>
                        <ListItemText primary="Colaboradores" />
                    </CustomListItem>
                </List>
            </CustomDrawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: open ? `${drawerWidth}px` : 0,
                    transition: 'margin 0.3s ease',
                }}
            >
                <Toolbar />
                <Outlet context={{ drawerOpen: open }} />
            </Box>
        </Box>
    );
}
