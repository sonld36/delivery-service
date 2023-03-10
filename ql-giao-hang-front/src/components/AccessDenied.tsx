import React from 'react'
import { Box, Typography } from '@mui/material';
import { grey, blueGrey } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const primary = grey[500];

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Stack direction={"column"}>
        <Typography variant="h1" style={{ color: 'white', margin: "auto" }}>
          403
        </Typography>

        <Typography variant="h5" style={{ color: 'white' }} >
          Bạn không có quyền truy cập vào trang này <Typography variant="h5" style={{
            color: blueGrey[600],
            margin: "auto",
            display: "flex",
            justifyContent: "space-around",
            cursor: "pointer"
          }} onClick={() => navigate(-1)}>Quay lại!</Typography>
        </Typography>
      </Stack>
    </Box>
  )
}

export default AccessDenied