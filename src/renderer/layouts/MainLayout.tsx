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
    Chip,            // ✅ ADD
    Stack,           // ✅ ADD
    Dialog,          // ✅ ADD
    DialogTitle,     // ✅ ADD
    DialogContent,   // ✅ ADD
    DialogActions,   // ✅ ADD
    Button,          // ✅ ADD
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // ✅ ADD
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConstructionIcon from '@mui/icons-material/Construction';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BadgeIcon from '@mui/icons-material/Badge';
import MenuIcon from '@mui/icons-material/Menu';

import logoPrincipal from '../../assets/images/logos/logoPrincipalCLEAN.png';
import logoAV from '../../assets/images/logos/logoAV.jpg';

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

// ✅ ADD (perto das tuas consts)
type BuildChannel = 'dev' | 'beta' | 'stable';

const BUILD = {
    version: '0.1.0',      // depois a gente amarra isso num env/package.json
    channel: 'dev' as BuildChannel,
    platform: 'Desktop (Electron)',
} as const;

const CLIENT = {
    name: 'Atividade Vertical',
    tagline: 'Soluções nas Alturas',
} as const;


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

const ROUTE_TITLES: Record<string, string> = {
    '/painel': 'Painel',
    '/ferramentas': 'Ferramentas',
    '/movimentacoes': 'Movimentações',
    '/obras': 'Obras',
    '/colaboradores': 'Colaboradores',
};

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTitle =
        ROUTE_TITLES[location.pathname] ?? 'FerramentasControl';
    const [open, setOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: COLORS.background, minHeight: '100vh' }}>
            <CssBaseline />

            <CustomAppBar position="fixed" open={open}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => setOpen(!open)} sx={{ color: COLORS.text }}>
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ opacity: 0.2 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: 0.4,
                                color: COLORS.textPrimary,
                                textTransform: 'capitalize',
                            }}
                        >
                            {currentTitle}
                        </Typography>
                    </Box>

                    {/* ✅ ADD: Badges + Sobre + Bloco institucional */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                size="small"
                                label={`v${BUILD.version}`}
                                sx={{
                                    bgcolor: COLORS.surfaceLight,
                                    color: COLORS.textPrimary,
                                    fontWeight: 700,
                                    letterSpacing: 0.3,
                                }}
                            />
                            <Chip
                                size="small"
                                label={BUILD.platform}
                                sx={{
                                    bgcolor: 'transparent',
                                    color: COLORS.textMuted,
                                    border: `1px solid ${COLORS.surfaceLight}`,
                                }}
                                variant="outlined"
                            />
                        </Stack>

                        <Tooltip title="Sobre / Créditos">
                            <IconButton
                                onClick={() => setAboutOpen(true)}
                                sx={{
                                    color: COLORS.text,
                                    border: `1px solid ${COLORS.surfaceLight}`,
                                    borderRadius: 2,
                                }}
                            >
                                <InfoOutlinedIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Bloco institucional (o teu) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                                    {CLIENT.name}
                                </Typography>
                            </Box>

                            <Avatar
                                src={logoAV}
                                alt="Atividade Vertical"
                                variant="square"
                                sx={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: 4,
                                    bgcolor: 'transparent',
                                    filter: 'grayscale(100%)',
                                    opacity: 0.85,
                                    '& img': { objectFit: 'contain', width: 170 }, // ✅ AQUI é o tiro certo
                                }}
                            />
                        </Box>
                    </Stack>
                </Toolbar>
            </CustomAppBar>


            <CustomDrawer variant="persistent" anchor="left" open={open}>
                <Toolbar />
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 2,
                        pt: 2.5,
                        pb: 2,
                        gap: 1,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,

                        // “card” sutil: dá estrutura sem virar uma caixa dura
                        borderBottom: `1px solid rgba(255,255,255,0.08)`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',

                        // fundo premium: halo + fade (bem discreto)
                        background: `
                             radial-gradient(80% 60% at 50% 0%,
                              rgba(245,158,11,0.12) 0%,
                              rgba(255,255,255,0.04) 40%,
                              transparent 75%),
                                linear-gradient(180deg, rgba(255,255,255,0.03), transparent)
                        `,
                    }}
                >
                    <Tooltip title="FerramentasControl">
                        <Avatar
                            src={logoPrincipal}
                            alt="FerramentasControl"
                            sx={{
                                width: 230,          // 👈 menos dominante que 260
                                height: 240,         // 👈 mantém presença sem esmagar tudo
                                mb: 0.5,
                                borderRadius: 4,

                                // dá um “punch” de produto sem gritar
                                boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        />
                    </Tooltip>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                            px: 1.5,
                            py: 0.4,
                            borderRadius: 20,
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: 0.6,
                                color: COLORS.textPrimary,
                            }}
                        >
                            FerramentasControl
                        </Typography>

                        <Divider orientation="vertical" flexItem sx={{ opacity: 0.3 }} />

                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 600,
                                color: COLORS.textMuted,
                                letterSpacing: 0.5,
                            }}
                        >
                            v{BUILD.version}
                        </Typography>
                    </Box>


                    <Typography
                        variant="subtitle1"
                        sx={{
                            textAlign: 'center',
                            px: 1,
                            fontWeight: 800,      // 👈 premium (sólido)
                            letterSpacing: 0.3,   // 👈 menos espaçado = mais sofisticado
                            color: COLORS.textPrimary,
                            lineHeight: 1.15,
                            textShadow: '0 2px 10px rgba(0,0,0,0.35)',
                        }}
                    >
                        {APP.tagline}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            textAlign: 'center',
                            px: 1,
                            mt: 0.2,
                            fontWeight: 600,
                            letterSpacing: 0.8,
                            color: COLORS.textMuted,
                            textTransform: 'uppercase',
                            opacity: 0.9,
                        }}
                    >
                        {APP.subline}
                    </Typography>

                    <Divider sx={{ width: '86%', mt: 1.2, opacity: 0.25 }} />
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
            {/* ✅ ADD: Modal Sobre / Créditos */}
            <Dialog
                open={aboutOpen}
                onClose={() => setAboutOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 800 }}>
                    Sobre o FerramentasControl
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={logoPrincipal}
                                alt="FerramentasControl"
                                sx={{ width: 64, height: 64 }}
                            />
                            <Box>
                                <Typography sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
                                    FerramentasControl
                                </Typography>
                                <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                                    {APP.tagline} • {APP.subline}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider />

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={logoAV}
                                alt={CLIENT.name}
                                variant="square"
                                sx={{
                                    width: 96,
                                    height: 48,
                                    borderRadius: 1.5,
                                    filter: 'grayscale(100%)',
                                    opacity: 0.9,
                                }}
                            />
                            <Box>
                                <Typography sx={{ fontWeight: 800 }}>
                                    {CLIENT.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                                    {CLIENT.tagline}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider />

                        <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                            Build: <b>v{BUILD.version}</b> • Canal: <b>{BUILD.channel}</b> • Plataforma: <b>{BUILD.platform}</b>
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setAboutOpen(false)} variant="contained" sx={{ bgcolor: COLORS.primary, color: COLORS.background, fontWeight: 800 }}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ✅ ADD: Diálogo Sobre / Créditos */}
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
