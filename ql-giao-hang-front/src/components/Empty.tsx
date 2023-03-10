import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Container } from '@mui/system'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const EmptyContainerStyled = styled(Container)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    fontSize: "60px"
  },

  '& .MuiTypography-root': {
    fontSize: "13px"
  }
}))

const emptyTheme = createTheme();

function Empty(props: Props) {
  const { children } = props;

  return (
    <ThemeProvider theme={emptyTheme}>
      <EmptyContainerStyled sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box sx={{
          flexFlow: 'column',
          textAlign: 'center',
          color: '#A3A8AF',
          lineHeight: "40px"
        }}>
          {children}
        </Box>

      </EmptyContainerStyled>
    </ThemeProvider>
  )
}

export default Empty;