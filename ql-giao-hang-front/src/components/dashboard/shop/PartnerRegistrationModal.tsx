import AddressSelection from '@Components/AddressSelection';

import { Grid, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

function PartnerRegistrationModal() {
  const {
    register,
    formState: { errors, },
    control
  } = useFormContext();


  return (
    <>
      <Grid container direction={"column"} rowSpacing={4}>

        <Grid item xs>
          <TextField
            id="phone-number"
            required
            fullWidth
            autoFocus
            label="Số điện thoại"
            // variant="standard"
            error={!!errors["phoneNumber"]}
            helperText={errors["phoneNumber"] ? errors["phoneNumber"].message?.toString() : ""}
            {...register("phoneNumber")}
          />
        </Grid>

        <Grid item xs>
          <TextField
            id="full-name"
            required
            fullWidth
            autoFocus
            label="Tên cửa hàng"
            // variant="standard"
            error={!!errors["name"]}
            helperText={errors["name"] ? errors["name"].message?.toString() : ""}
            {...register("name")}
          />
        </Grid>

        <Grid item xs>
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
                // variant="standard"
                error={!!errors["addressDetail"]}
                helperText={errors["addressDetail"] ? errors["addressDetail"].message?.toString() : ""}
                {...register("addressDetail")}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default PartnerRegistrationModal