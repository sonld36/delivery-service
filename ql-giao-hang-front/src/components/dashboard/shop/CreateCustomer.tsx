import AddressSelection from '@Components/AddressSelection';
import Title from '@Components/Title';
import { CardHeaderStyled, CardStyled } from '@Components/Utils';
import { Box, Button, CardContent, Grid, TextField, Typography } from '@mui/material';
import React from 'react'
import { FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form'
import { TypeOf } from 'zod';
import { partnersRegistrationSchema } from '@Helpers/form.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressToSave, CustomerCreateType, CustomerType, ResponseReceived } from '@Common/types';
import { dataCustomerCreateOptimize } from '@Helpers/data.optimize';
import customerService from '@Services/customer.service';
import { useAppDispatch } from '@App/hook';
import { openToast } from '@Features/toast/toastSlice';
import { CustomerToastPayload } from '@Common/toast.const';

type CustomerRegisterForm = TypeOf<typeof partnersRegistrationSchema>

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCustomerChoosen: React.Dispatch<React.SetStateAction<CustomerType<AddressToSave[]> | any>>
}


function CreateCustomer(props: Props) {

  const { setOpen } = props;

  const dispatch = useAppDispatch();
  const methodParent = useFormContext();


  const methodChild = useForm<CustomerRegisterForm>({
    resolver: zodResolver(partnersRegistrationSchema),
    defaultValues: (
      {
        name: "",
        addressDetail: "",
        address: undefined,
        phoneNumber: ""
      }
    ),
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = methodChild;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpen(false);
    }
  }, [isSubmitSuccessful, reset, setOpen]);

  const handleSubmitForm: SubmitHandler<CustomerRegisterForm> = async (values) => {
    const data: CustomerCreateType = dataCustomerCreateOptimize(values);

    const resp: ResponseReceived<CustomerType<AddressToSave[]>> = await customerService.create(data);

    if (resp.status && resp.status >= 300) {
      dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 4001]));
    } else {
      dispatch(openToast(CustomerToastPayload[resp.code ? resp.code : 2002]));

      // setCustomerChoosen(resp.data);
      methodParent.setValue("customer", resp.data);
    }
  }

  return (
    <CardStyled>
      <CardHeaderStyled
        title={<Title title='Thêm khách hàng' />}
      />
      <CardContent>
        <FormProvider {...methodChild}>
          <Box component={"form"} noValidate
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  required
                  fullWidth
                  autoFocus
                  label="Họ và tên"
                  variant="standard"
                  error={!!errors["name"]}
                  helperText={errors["name"] ? errors["name"].message?.toString() : ""}
                  {...register("name")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="phone-number"
                  required
                  fullWidth
                  autoFocus
                  label="Số điện thoại"
                  variant="standard"
                  error={!!errors["phoneNumber"]}
                  helperText={errors["phoneNumber"] ? errors["phoneNumber"].message?.toString() : ""}
                  {...register("phoneNumber")}
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container rowSpacing={2} >
                  <Grid item xs={12}>
                    <Typography>Địa chỉ (Tỉnh - Quận/Huyện - Xã/Phường)</Typography>
                    <AddressSelection control={control} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="address-detail"
                      required
                      fullWidth
                      autoFocus
                      label="Địa chỉ chi tiết"
                      variant="standard"
                      error={!!errors["addressDetail"]}
                      helperText={errors["addressDetail"] ? errors["addressDetail"].message?.toString() : ""}
                      {...register("addressDetail")}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained"
                  type='submit'
                  sx={{
                    float: "right",
                    textTransform: "capitalize"
                  }}
                >Lưu</Button>
              </Grid>
            </Grid>

          </Box>
        </FormProvider>
      </CardContent>
    </CardStyled>


  )
}

export default CreateCustomer