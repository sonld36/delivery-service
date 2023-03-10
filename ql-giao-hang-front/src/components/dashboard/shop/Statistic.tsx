import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { CardHeaderStyled } from '@Components/Utils';
import Title from '@Components/Title';
import orderService from '@Services/order.service';
import Grid from '@mui/material/Grid';

export default function Statistic() {

  const [totalOrder, setTotalOrder] = React.useState(0);
  const [codOrder, setCodOrder] = React.useState(0);
  const [paidOrder, setPaidOrder] = React.useState(0)

  React.useEffect(() => {
    const fetchOrderNotDone = async () => {
      const resp = await orderService.getNotDoneYet();

      const data = resp.data;

      var total = 0;
      var cod = 0;
      var paid = 0;

      data.forEach((item) => {
        if (item.type === "COD") cod++;
        if (item.type === "PAID") paid++;
        total++;
      });

      setCodOrder(cod);
      setPaidOrder(paid);
      setTotalOrder(total);

    }

    fetchOrderNotDone();
  }, [])

  return (
    <React.Fragment>
      <CardHeaderStyled
        title={
          <Title title='Thống kê đơn hàng đang chờ' />
        }
      />
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8}>
              <Typography color="text.secondary" >
                Tổng đơn hàng
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component="p" variant="h4" sx={{
                width: "fit-content",
                float: "right"
              }}>
                {totalOrder}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8}>
              <Typography color="text.secondary" >
                Số đơn ship COD
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component="p" variant="h4" sx={{
                width: "fit-content",
                float: "right"
              }}>
                {codOrder}
              </Typography>
            </Grid>
          </Grid>
        </Grid>


        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8}>
              <Typography color="text.secondary" >
                Số đơn đã thanh toán
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component="p" variant="h4" sx={{
                width: "fit-content",
                float: "right"
              }}>
                {paidOrder}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

      </Grid>


    </React.Fragment>
  );
}