import { ProductTop10Type } from '@Common/types';
import RecentOrder from '@Components/order/RecentOrder';
import Title from '@Components/Title';
import { CardHeaderStyled, CardStyled } from '@Components/Utils';
import Statistic from '@Components/dashboard/shop/Statistic';
import { getTodayTime } from '@Helpers/data.optimize';
import { partnersRegistrationSchema } from '@Helpers/form.validate';
import { Box, Grid, Paper } from '@mui/material';
import orderService from '@Services/order.service';
import shopService from '@Services/shop.service';
import { useEffect, useState } from 'react';
import ReactApexChart, { Props } from 'react-apexcharts';
import { TypeOf } from 'zod';

export type PartnersRegisterForm = TypeOf<typeof partnersRegistrationSchema>


function OverviewPage({ task }: Props) {

  const [refundData, setRefundData] = useState<number[]>([]);
  const [processingData, setProcessingData] = useState<number[]>([]);
  const [doneData, setDoneData] = useState<number[]>([]);
  const [categoriesChart, setCategoriesChart] = useState<string[]>([]);


  const [totalOrderInDayData, setTotalOrderInDayData] = useState<number[]>([]);
  const [doneOrderInDayData, setDoneOrderInDayDate] = useState<number[]>([]);
  const [dateCategoriesChart, setDateCategoriesChart] = useState<string[]>([]);

  const data = {

    series: [{
      name: 'Hủy/Hoàn',
      data: refundData
    }, {
      name: 'Chưa giao',
      data: processingData
    }, {
      name: 'Giao thành công',
      data: doneData
    }],
    options: {
      chart: {
        // type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: categoriesChart,
      },
      yaxis: {
        title: {
          text: 'Số lượng sản phẩm'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + " đơn"
          }
        }
      }
    },

  }

  const dataForOrder = {

    series: [{
      name: "Tổng đơn hàng",
      data: totalOrderInDayData
    },
    {
      name: "Đơn giao thành công",
      data: doneOrderInDayData
    },

    ],
  };

  useEffect(() => {
    const fetchTop10Product = async () => {
      var date = new Date(new Date().setDate(new Date().getDate() - 30));
      const thirtyDaysBefore = getTodayTime(date);
      const now = getTodayTime();

      const resp = await shopService.getTop10ProductByRangeDate(thirtyDaysBefore, now);

      const data: ProductTop10Type[] = resp.data;
      const refund: number[] = new Array(10).fill(0);
      const processing: number[] = new Array(10).fill(0);
      const done: number[] = new Array(10).fill(0);
      const categories: string[] = [];
      data.forEach(item => {
        if (!categories.includes(item.productName)) {
          categories.push(item.productName);
        }

        const index = categories.indexOf(item.productName);

        if (["WAITING_FOR_ACCEPT_NEW_ORDER", "REQUEST_SHIPPING", "PICKING_UP_GOODS", "BEING_TRANSPORTED"].includes(item.status)) {
          processing[index] = processing[index] + item.totalByStatus;
        } else if (["DELIVERY_SUCCESSFUL", "DONE"].includes(item.status)) {
          done[index] = done[index] + item.totalByStatus;
        } else if (["REFUNDS", "CANCEL"].includes(item.status)) {
          refund[index] = refund[index] + item.totalByStatus;
        }
      });

      setRefundData(refund);
      setProcessingData(processing);
      setDoneData(done);
      setCategoriesChart(categories);
    }


    const fetchOrderInThirtyDays = async () => {
      var date = new Date(new Date().setDate(new Date().getDate() - 30));
      const thirtyDaysBefore = getTodayTime(date);
      const now = getTodayTime();
      const resp = await orderService.countOrderInThirtyDays(thirtyDaysBefore, now);
      const data = resp.data;

      const total: number[] = [];
      const done: number[] = [];
      const categories: string[] = [];
      // console.log(resp);
      data.forEach(item => {
        if (!categories.includes(item.dateCreate)) {
          categories.push(item.dateCreate);
        }

        const index = categories.indexOf(item.dateCreate);

        if (["DELIVERY_SUCCESSFUL", "DONE"].includes(item.status)) {
          done[index] = (done[index] ? done[index] : 0) + item.countOrder;
        } else {
          done[index] = (done[index] ? done[index] : 0) + 0;
        }

        total[index] = (total[index] ? total[index] : 0) + item.countOrder;
      });
      setDoneOrderInDayDate(done);
      setTotalOrderInDayData(total);
      setDateCategoriesChart(categories);

    }

    fetchTop10Product();
    fetchOrderInThirtyDays();

  }, []);


  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={9}>
          <CardStyled>
            <CardHeaderStyled
              title={<Title title='Số đơn hàng hoàn thành theo thời gian được đặt trong 30 ngày' />}
            />
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                // height: 280,
              }}
            >
              <ReactApexChart options={{
                chart: {
                  height: 350,
                  type: 'line',
                  zoom: {
                    enabled: false
                  },
                },
                dataLabels: {
                  enabled: false
                },
                stroke: {
                  width: [5, 7, 5],
                  curve: 'straight',
                  dashArray: [0, 8, 5]
                },
                legend: {
                  tooltipHoverFormatter: function (val: any, opts: any) {
                    return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                  }
                },
                markers: {
                  size: 0,
                  hover: {
                    sizeOffset: 6
                  }
                },
                xaxis: {
                  categories: dateCategoriesChart,
                },
                tooltip: {
                  y: [
                    {
                      title: {
                        formatter: function (val: any) {
                          return val + " (mins)"
                        }
                      }
                    },
                    {
                      title: {
                        formatter: function (val: any) {
                          return val + " "
                        }
                      }
                    },
                    {
                      title: {
                        formatter: function (val: any) {
                          return val;
                        }
                      }
                    }
                  ]
                },
                grid: {
                  borderColor: '#f1f1f1',
                }
              }} series={dataForOrder.series} type="line" height={350} />
            </Paper>
          </CardStyled>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>

          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',

            }}
          >
            <Statistic />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <CardStyled>
            <CardHeaderStyled
              title={<Title title='Top 10 sản phẩm được đặt nhiều nhất trong 30 ngày gần nhất' />}
            />
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                // height: 280,
              }}
            >
              <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />
            </Paper>
          </CardStyled>

        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <RecentOrder />
        </Grid>
      </Grid>
    </Box>
  )
}

export default OverviewPage;