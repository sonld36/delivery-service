import { SMALL } from '@Common/size.const';
import { LoginBackgroundImage, MainLogo } from '@Helpers/image.handle';
import { Grid, Link, Typography, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import * as React from 'react';

type Props = {
  children: React.ReactNode
}

const theme = createTheme();

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx={{ mb: 5 }}>
      {'Tải app dành cho nhân viên giao hàng '}
      <Link color="inherit" href="https://drive.google.com/drive/folders/1NerwMuN-TWjtF0ewXI59581qMPe8RryD?usp=sharing">
        Tại đây
      </Link>{' '}
      {'.'}
    </Typography>
  );
}

function Title(props: any) {
  return (
    <Box sx={{
      height: "100%",
    }}>
      <Grid
        container
        direction={"column"}
        justifyContent="center"
        alignItems={"center"}
        sx={{
          height: "inherit",
        }}
      >
        <img src={MainLogo} alt="logo-sapo" />

      </Grid>
    </Box>
  )
}

export default function Authenication(props: Props) {
  const { children } = props;
  const smallMatches = useMediaQuery(SMALL);
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {smallMatches && (
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${LoginBackgroundImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'contain',
              backgroundPosition: 'bottom',
              position: 'relative'
            }}
          >
            <Title />

          </Grid>
        )}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {/* {!smallMatches && <Title />} */}
          {children}
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}