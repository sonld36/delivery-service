import Title from '@Components/Title';
import { CardHeaderStyled, CardStyled } from '@Components/Utils';
import { CardContent, Grid, Stack } from '@mui/material';
import { BasicTabs } from './CustomerRegisterList';

type Props = {

}

function Overview(props: Props) {
  return (
    <Grid container>
      <Grid item xs={8}>
        <Stack>
          <CardStyled>
            <CardHeaderStyled title={<Title title='Chờ đăng ký đối tác' />} />
            <CardContent>
              <BasicTabs />
            </CardContent>
          </CardStyled>
        </Stack>
      </Grid>
      <Grid item xs={4}>

      </Grid>

    </Grid>
  )
}

export default Overview;
