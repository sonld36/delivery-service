import { useAppDispatch } from '@App/hook';
import { CustomerToastPayload } from '@Common/toast.const';
import { AddressToSave, CustomerType, ResponseReceived } from '@Common/types';
import AddressSelection from '@Components/AddressSelection';
import { openToast } from '@Features/toast/toastSlice';
import { addAddressSchema } from '@Helpers/form.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import DetailsIcon from '@mui/icons-material/Details';
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import customerService from '@Services/customer.service';
import provinceService from '@Services/province.service';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { TypeOf } from 'zod';

type Props = {
  customer: CustomerType<AddressToSave[]>,
  addressChoosen: number,
  setAddressChoosen: any
}

type AddAddressForm = TypeOf<typeof addAddressSchema>;

function CustomerDisplay(props: Props) {
  const { customer, addressChoosen, setAddressChoosen } = props;
  const [custumerFetch, setCustomerFetch] = useState<CustomerType<string[]> | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAddress = async () => {
      const addressesText = await Promise.all(customer.addresses.map(async (item, index) => {
        const addressText: any = await provinceService.getAddress(item);
        return addressText;
      }));

      setCustomerFetch({
        ...customer,
        addresses: addressesText
      });
    }

    fetchAddress();
  }, [customer]);

  const methodsChild = useForm<AddAddressForm>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      addressDetail: "",
      address: undefined,
    }
  });

  const { control,
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = methodsChild;

  const handleSubmitCreateAddressForm: SubmitHandler<AddAddressForm> = async (values, event) => {
    event?.preventDefault();
    const data: AddressToSave = {
      addressDetail: values.addressDetail,
      ...values.address
    }

    if (custumerFetch) {
      const resp: ResponseReceived<AddressToSave> = await customerService.addAddress(data, custumerFetch.id);
      // console.log(resp);
      dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 2001]));
      handleClose();
      const addresses = custumerFetch.addresses;
      setCustomerFetch({
        ...custumerFetch,
        addresses: []
      });

      // const addressWatch = watch("address", []);
      customer.addresses.push(resp.data);

      const addressText = await provinceService.getAddress(resp.data);
      addresses.push(addressText);
      setCustomerFetch({
        ...custumerFetch,
        addresses: addresses
      });


    }

  }


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);


  return (
    <>
      <Grid container>

        <Grid item xs={3} sx={{
          padding: "10px 15px"
        }}>
          <Stack direction="column" spacing={1}>
            <Chip label={`${customer.name}`} />
            <Chip label={`${customer.phoneNumber}`} />
          </Stack>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs={8}>
          {/* <CardHeaderStyled
            title={<Title title='Địa chỉ' />}
          /> */}
          <CardContent>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                <Stack direction={"row"}>
                  <Typography sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 1
                  }}>Địa chỉ</Typography>
                  <Tooltip title="Thêm địa chỉ mới">
                    <IconButton size='small'
                      disabled={custumerFetch?.addresses && custumerFetch?.addresses.length > 2}
                      onClick={handleClick}
                      aria-controls={open ? 'add-address' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>

                </Stack>
              </FormLabel>
              {customer.addresses.length > 0 ? (<RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                onChange={(event) => {
                  setAddressChoosen(event.target.value);

                }}
                value={addressChoosen}
              >
                {custumerFetch && custumerFetch.addresses.length > 0 ? (
                  <>
                    <Stack direction="column" spacing={0}>
                      {custumerFetch.addresses.map((item, index) => (
                        <FormControlLabel key={index} value={index} control={<Radio />} label={<Chip label={`${item}`} />} />
                      ))}
                    </Stack>
                    {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
                  </>
                ) : (<Box>
                  <CircularProgress />

                </Box>)}
              </RadioGroup>) : <>Chưa có địa  chỉ</>}
              {/* <FormHelperText>{errors['address'] ? errors['address'].message : ""}</FormHelperText> */}
            </FormControl>
          </CardContent>
        </Grid>

      </Grid>
      <Menu
        anchorEl={anchorEl}
        id="add-address"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
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
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box
          component={"form"}
          noValidate
          onSubmit={methodsChild.handleSubmit(handleSubmitCreateAddressForm)}
        >
          <MenuItem >
            <TextField
              id="input-with-icon-textfield"
              label="Địa chỉ chi tiết"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DetailsIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              fullWidth
              error={!!errors["addressDetail"]}
              helperText={errors["addressDetail"] ? errors["addressDetail"].message?.toString() : ""}
              {...register("addressDetail")}
            />
          </MenuItem>
          <MenuItem >
            <AddressSelection control={control} />
          </MenuItem>
          <MenuItem sx={{
            float: 'right'
          }}>
            <Button size="small"
              type='submit'
            >Thêm</Button>
          </MenuItem>
        </Box>
      </Menu>
    </>
  )
}

export default CustomerDisplay