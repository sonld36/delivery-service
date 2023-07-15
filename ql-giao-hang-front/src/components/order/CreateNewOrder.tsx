import { useAppDispatch } from '@App/hook';
import { OrderToastPayload } from '@Common/toast.const';
import { AddressToSave, CustomerType, PaymentType } from '@Common/types';
import CreateCustomer from '@Components/dashboard/shop/CreateCustomer';
import { shopLink } from '@Components/dashboard/shop/Sidebar';
import Empty from '@Components/Empty';
import SearchCustomer from '@Components/search-input/SearchCustomer';
import SearchProduct from '@Components/search-input/SearchProduct';
import TransitionsModal from '@Components/TransitionsModal';
import { CardHeaderStyled, CardStyled } from '@Components/Utils';
import styled from '@emotion/styled';
import { openToast } from '@Features/toast/toastSlice';
import { convertNumberToCurrency, getTodayTime } from '@Helpers/data.optimize';
import { orderCreateSchema } from '@Helpers/form.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Button, CardActions, Container, Fab, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import orderService from '@Services/order.service';
import provinceService from '@Services/province.service';
import shopService from '@Services/shop.service';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TypeOf } from 'zod';
import CustomerDisplay from './CustomerDisplay';
import ProductDisplay from './ProductDisplay';
import { orderType } from '@Common/const';
import mapService from '@Services/map.service';


const theme = createTheme();

const productString = /^products/;
const productRegex = new RegExp(productString);

type OrderCreateForm = TypeOf<typeof orderCreateSchema>;


const LabelStyled = styled(Typography)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',

}));

type TotalPay = {
  quantity: number;
  priceOfQuantities: number;
  vat: number;
  shipFee: number;
  mustPay: number;
  typePayment: string;
  restPaid: number;
}

function CreateNewOrder() {

  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [customerChoosen, setCustomerChoosen] = useState<CustomerType<AddressToSave[]> | any>();
  const [shopAddress, setShopAddress] = useState<string | undefined>(undefined);
  const [addressChoosen, setAddressChoosen] = useState<number>(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [totalPay, setTotalPay] = useState<TotalPay>({
    quantity: 0,
    priceOfQuantities: 0,
    vat: 0,
    shipFee: 0,
    typePayment: PaymentType.COD,
    mustPay: 0,
    restPaid: 0,
  })


  const methods = useForm<OrderCreateForm>({
    resolver: zodResolver(orderCreateSchema),
    defaultValues: {
      customer: undefined,
      products: [],
      timeReceiveExpected: undefined,
      orderType: PaymentType.COD,
      note: "",
      shipFee: 0,
      destinationAddress: "",
      fromAddress: "",
      destinationLat: 0,
      destinationLongitude: 0,
      fromLat: 0,
      fromLongitude: 0,
    }
  });

  const {
    register,
    formState: { errors },
    reset,
    watch,
    getValues,

  } = methods;


  const productWatch = watch("products", []);
  // console.log(productWatch);


  const handleCreateCustomer = () => {
    setOpenCreateCustomer(true);
  }

  useEffect(() => {
    const subscription = watch((values, { name, type }) => {
      if (name === "customer") {
        setCustomerChoosen(values.customer);
      }
      if (name && (productRegex.test(name) || name === "orderType")) {
        // console.log(productWatch);
        let products = getValues("products");
        products = products.map((item) => ({
          ...item,
          quantity: item.quantity ? Number.parseInt(item.quantity) : 1
        }))

        const totalProduct = products.reduce((prev, curr) => prev + curr.quantity, 0);
        const totalPay = products.reduce((prev, curr) =>
          prev + (curr.quantity * curr.salePrice), 0);

        const totalWeight = products.reduce((prev, curr) => prev + curr.weight * curr.quantity, 0);
        var shipFee = totalWeight * 20000;

        if (shipFee > 40000) {
          shipFee = 40000
        } else if (shipFee < 20000) {
          shipFee = 20000;
        }
        const VAT = totalPay * 0.1;

        const handleRestpaid = getValues().orderType === PaymentType.COD ? totalPay : 0;
        // console.log(orderTypeWatch === PaymentType.COD);

        setTotalPay({
          quantity: totalProduct,
          priceOfQuantities: totalPay,
          shipFee: shipFee,
          vat: VAT,
          mustPay: totalPay + shipFee + VAT,
          typePayment: getValues().orderType,
          restPaid: handleRestpaid + shipFee + VAT
        })
      }

      return () => subscription.unsubscribe();
    })
  }, [watch]);



  useEffect(() => {
    const getShopAddress = async () => {
      const address = await shopService.getAddressByShopId();
      const addressText = await provinceService.getAddress(address.data);
      setShopAddress(addressText);
    }

    getShopAddress();
  }, [])

  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const dataNotOptimize: OrderCreateForm = getValues();

    const address: any = dataNotOptimize.customer.addresses.at(addressChoosen);
    const addressText = await provinceService.getAddress(address);

    const coordinate = await mapService.getCoordinate(addressText);

    let products = dataNotOptimize.products.map((item) => (
      {
        ...item,
        quantity: Number.parseInt(item.quantity)
      }
    ));

    const dataToRequest: any = {
      ...dataNotOptimize,
      products,
      shipFee: totalPay.shipFee,
      paymentTotal: totalPay.restPaid,
      type: dataNotOptimize.orderType,
      fromAddress: shopAddress,
      destinationAddress: addressText,

      destinationLongitude: coordinate[0],
      destinationLat: coordinate[1],
    }

    const resp = await orderService.createOrder(dataToRequest);
    if (resp.status && resp.status >= 300) {
      dispatch(openToast(OrderToastPayload[resp.code ? resp.code : 4001]));
    } else {
      dispatch(openToast(OrderToastPayload[resp.code ? resp.code : 20002]));
      reset();
      return navigate(`/shop/${shopLink.ORDER_LIST}`);
    }
  }


  return (
    <>

      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <TransitionsModal content={
            <CreateCustomer setOpen={setOpenCreateCustomer} setCustomerChoosen={setCustomerChoosen} />}
            open={openCreateCustomer}
            setOpen={setOpenCreateCustomer}
          />
          <Box component={"form"} noValidate onSubmit={(event) => handleSubmitForm(event)}>
            <Grid container spacing={2}>
              <Grid item className='Receiver-infor' xs={8}>
                <CardStyled >
                  <CardHeaderStyled
                    title={<Box>
                      <Typography>Thông tin người nhận</Typography>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Box>}
                  />

                  <CardActions >
                    <SearchCustomer

                    />
                    <Box>
                      <Tooltip title="Thêm khách hàng">
                        <Fab color="primary" aria-label="add" size='small' onClick={handleCreateCustomer}>
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Box>
                  </CardActions>

                  <CardContent>
                    {customerChoosen ? <CustomerDisplay customer={customerChoosen}
                      addressChoosen={addressChoosen}
                      setAddressChoosen={setAddressChoosen} /> : (<Empty>
                        <ContactEmergencyIcon
                          sx={{
                            fontSize: '50px'
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '13px'
                          }}
                        >Chưa có thông tin khách hàng</Typography>
                      </Empty>)}
                  </CardContent>
                </CardStyled>
              </Grid>
              <Grid item className='Receiver-more-infor' xs={4}>
                <CardStyled>
                  <Grid container direction={'column'}>
                    <Grid item>
                      <CardHeaderStyled
                        title={
                          <Box>
                            <Typography>Thông tin bổ sung</Typography>
                            <Grid item xs={12}>
                              <Divider />
                            </Grid>
                          </Box>
                        }
                      />

                    </Grid>
                    <Grid item>
                      <CardContent>
                        <Grid container rowSpacing={3} columnSpacing={2}>

                          <Grid item xs={4}>
                            <LabelStyled variant='subtitle2'>Địa chỉ shop</LabelStyled>
                          </Grid>
                          <Grid item xs={8}>
                            {shopAddress}
                          </Grid>

                          <Grid item xs={4}>
                            <LabelStyled variant='subtitle2'>Hẹn giao</LabelStyled>
                          </Grid>
                          <Grid item xs={8}>
                            <TextField
                              id="date"
                              type="date"
                              defaultValue={getTodayTime()}
                              sx={{ width: '100%', fontSize: '13px', }}
                              size="small"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={!!errors['timeReceiveExpected']}
                              helperText={errors['timeReceiveExpected'] ? errors['timeReceiveExpected'].message : ""}

                              {...register("timeReceiveExpected")}

                            />
                          </Grid>

                          <Grid item xs={4}>
                            <LabelStyled variant='subtitle2'>Kiểu thanh toán</LabelStyled>
                          </Grid>
                          <Grid item xs={8}>
                            <Select
                              labelId="demo-simple-select-autowidth-label"
                              id="demo-simple-select-autowidth"
                              // value={age}
                              defaultValue={PaymentType.COD}
                              sx={{
                                width: '100%',
                                fontSize: '13px',
                              }}
                              size='small'
                              error={!!errors['orderType']}
                              {...register("orderType")}
                            >
                              <MenuItem value={PaymentType.COD}>
                                <Typography variant='subtitle2' sx={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden'
                                }}>COD (Thanh toán khi nhận hàng)</Typography>
                              </MenuItem>
                              <MenuItem value={PaymentType.PAID}>
                                <Typography variant='subtitle2'>Đã thanh toán</Typography>
                              </MenuItem>
                            </Select>
                            <FormHelperText>{errors['orderType'] ? errors['orderType'].message : ""}</FormHelperText>
                          </Grid>

                        </Grid>
                      </CardContent>
                    </Grid>
                  </Grid>
                </CardStyled>
              </Grid>
              <Grid item className='Receiver-product' xs={12}>
                <CardStyled>
                  <Grid container direction={'column'}>
                    <Grid item>
                      <CardHeaderStyled
                        title={<Box>
                          <Typography>Thông tin sản phẩm</Typography>
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        </Box>}
                      />

                      <CardActions>
                        <SearchProduct />
                      </CardActions>
                    </Grid>

                    <CardContent>
                      <FormProvider {...methods}>
                        {productWatch.length > 0 ? (<ProductDisplay
                        // products={productsChoosen} 
                        />) : (<Empty>
                          <Inventory2Icon />
                          <Typography>
                            Chưa có thông tin sản phẩm
                          </Typography>

                          <Button variant="outlined" size='medium' sx={{
                            textTransform: "capitalize"
                          }}
                            onClick={() => navigate(`/shop/${shopLink.CREATE_PROD}`)}
                          >Thêm sản phẩm</Button>
                        </Empty>)}
                      </FormProvider>
                    </CardContent>

                  </Grid>
                </CardStyled>
              </Grid>
              <Grid item className='Receiver-note' xs={5}>
                <CardStyled>
                  <Grid container direction={"column"}>
                    <Grid item>
                      <CardHeaderStyled
                        title={<Box>
                          <Typography>Ghi chú <>*</></Typography>
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        </Box>}
                      />

                    </Grid>

                    <Container>
                      <TextField
                        id="outlined-multiline-static"
                        // label="Multiline"
                        multiline
                        fullWidth
                        placeholder='VD: Để hàng trước cửa nhà'
                        maxRows={12}
                        minRows={8}
                        error={!!errors['note']}
                        helperText={errors['note'] ? errors['note'].message : ""}
                        {...register("note")}
                      />
                    </Container>

                  </Grid>
                </CardStyled>
              </Grid>
              {/* <Grid xs={8}>

              </Grid> */}
              <Grid item className='Receiver-payment-total' xs={7}>
                <CardStyled>
                  <CardHeaderStyled
                    title={<Box>
                      <Typography>Thành tiền</Typography>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Box>}
                  />
                  <Container>
                    <Grid container rowSpacing={1.5}
                    >
                      <Grid item xs={8}>
                        <Typography>Tổng tiền ({totalPay.quantity} sản phẩm)</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            float: 'right'
                          }}
                        >{convertNumberToCurrency(totalPay.priceOfQuantities)}</Typography>
                      </Grid>

                      <Grid item xs={8}>
                        <Typography>VAT (10%)</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            float: 'right'
                          }}
                        >{convertNumberToCurrency(totalPay.vat)}</Typography>
                      </Grid>
                      <Grid item xs={8}>
                      </Grid>
                      <Grid item xs={4}>
                        <Divider />
                      </Grid>

                      <Grid item xs={8}>
                        <Typography>Phí giao hàng</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            float: 'right'
                          }}
                        >{convertNumberToCurrency(totalPay.shipFee)}</Typography>
                      </Grid>
                      <Grid item xs={8}>
                      </Grid>
                      <Grid item xs={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>Khách phải trả</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            float: 'right'
                          }}
                        >{convertNumberToCurrency(totalPay.mustPay)}</Typography>
                      </Grid>

                      <Grid item xs={8}>
                      </Grid>
                      <Grid item xs={4}>
                        <Divider />
                      </Grid>

                      <Grid item xs={8}>
                        <Typography>Phương thức thanh toán</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{
                          float: 'right'
                        }}
                        >{orderType[getValues().orderType]}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={8}>
                        <Typography>Còn phải trả</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{
                          float: 'right'
                        }}
                        >{convertNumberToCurrency(totalPay.restPaid)}</Typography>
                      </Grid>
                    </Grid>
                  </Container>
                </CardStyled>
              </Grid>
              <Grid item xs>
                <Button variant="contained"
                  size='medium'
                  sx={{
                    float: 'right',
                    textTransform: "capitalize"
                  }}
                  type={"submit"}
                >Tạo đơn hàng</Button>
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </ThemeProvider></>
  )
}

export default CreateNewOrder