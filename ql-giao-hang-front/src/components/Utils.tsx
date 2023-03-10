import styled from '@emotion/styled'
import { Card, CardHeader } from '@mui/material'
import React from 'react'

export const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  padding: "5px",
  "& .MuiTypography-root": {
    fontSize: "20px",
  }
}))

const heightCard = 300;

export const CardStyled = styled(Card)(({ theme }) => ({
  minHeight: heightCard,
  padding: '5px 10px',

  "& .MuiCardContent-root": {
    padding: "0 20px",
  }
}));