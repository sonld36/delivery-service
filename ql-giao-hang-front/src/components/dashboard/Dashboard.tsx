import { useAppDispatch, useAppSelector } from '@App/hook';
import { ToastPayloadCustom } from '@Common/toast.const';
import { openToast } from '@Features/toast/toastSlice';
import { logout, selectUser } from '@Features/user/userSlice';
import { usePageTitle } from '@Helpers/hooks';
import { MainLogo } from '@Helpers/image.handle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import { Avatar, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

type Props = {
  sidebar: React.ReactNode,
  mainContent?: React.ReactNode,
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      backgroundColor: '#182238',
      color: '#A3A8AF',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      lineHeight: theme.spacing(3),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
        '& .MuiCollapse-root': {
          display: 'none',
        }
      }),
    },

    '& .MuiListItemText-primary': {
      fontSize: '13px',
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent(props: Props) {
  const dispatch = useAppDispatch();
  const { sidebar, mainContent } = props;
  const inforUser = useAppSelector(state => selectUser(state));
  const { user } = inforUser;
  const [open, setOpen] = React.useState(true);

  const location = useLocation();
  const title = usePageTitle(location.pathname);
  const navigate = useNavigate();


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openDropdown = Boolean(anchorEl);


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutHandler = () => {
    handleClose();
    dispatch(logout())
  }

  const onNavigateProfilePage = () => {
    handleClose();
    navigate("profile")
  }

  React.useEffect(() => {
    const alertWelcome = () => {
      const { username } = user;
      dispatch(openToast(ToastPayloadCustom.welcome(username)));
    }

    alertWelcome();
  }, [user]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ bgcolor: '#fff', color: '#000' }}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <Box sx={{ display: 'flex', mr: "20px" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openDropdown ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDropdown ? 'true' : undefined}
                  tabIndex={0}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: green[500] }}>S</Avatar>
                </IconButton>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openDropdown}
                onClose={handleClose}
                onClick={handleClose}
                tabIndex={0}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={onNavigateProfilePage}>
                  <Avatar /> Thông tin cá nhân
                </MenuItem>
                <MenuItem onClick={onLogoutHandler}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ display: 'flex', mr: "20px" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} className="u-text-color-white">
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: [1],
            }}
          >
            <Box sx={{
              display: "flex",
              alignItems: "end"
            }}>
              <img src={MainLogo} alt="logo_sapo" style={{
                width: "100px"
              }} />
              <Typography sx={{
                fontSize: "10px",
              }}>delivery</Typography>
            </Box>
            <IconButton onClick={toggleDrawer} sx={{ color: 'inherit' }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider sx={{ bgcolor: '#fff' }} />
          <List component="nav">
            {/* nội dung các option của sidebar */}
            {sidebar}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 2, mb: 2, ml: 0, padding: 0 }}>
            {/* nội dung chính */}
            {mainContent ? mainContent : <Outlet />}
          </Container>
        </Box>
      </Box>
    </ThemeProvider >
  );
}



export default function Dashboard(props: Props) {
  const { sidebar, mainContent } = props;
  return <DashboardContent mainContent={mainContent} sidebar={sidebar} />;
}
