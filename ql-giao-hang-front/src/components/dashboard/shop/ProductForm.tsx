import Title from '@Components/Title';
import UploadImages from '@Components/UploadImages';
import { CardHeaderStyled, CardStyled } from '@Components/Utils';
import { Button, CardContent, Divider, FormControlLabel, FormHelperText, Grid, InputAdornment, OutlinedInput, Switch, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Controller, FormProvider, SubmitHandler, useFormContext } from 'react-hook-form';

type Props = {
  handleSubmitForm: SubmitHandler<any>
}

function ProductForm(props: Props) {
  const { handleSubmitForm } = props;

  const methods = useFormContext();

  const {
    handleSubmit,
    register,
    control

  } = methods;

  return (
    <Box component={"form"} noValidate onSubmit={handleSubmit(handleSubmitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <CardStyled>
            <CardHeaderStyled
              title={<Title title='Thông tin chung' />}
            />
            <CardContent sx={{

            }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormHelperText>Tên sản phẩm*</FormHelperText>
                  <TextField
                    // label="Tên sản phẩm"
                    id="product-name"
                    size="small"
                    placeholder='Nhập tên sản phẩm'
                    fullWidth
                    error={!!methods.formState.errors["name"]}
                    helperText={methods.formState.errors["name"] ? methods.formState.errors["name"].message?.toString() : ""}
                    {...register("name")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormHelperText>Mã sản phẩm/SKU*</FormHelperText>
                  <TextField
                    fullWidth
                    // label="Mã sản phẩm/SKU"
                    id="product-code"
                    size="small"
                    placeholder='Nhập mã sản phẩm'
                    error={!!methods.formState.errors["productCode"]}
                    helperText={methods.formState.errors["productCode"] ? methods.formState.errors["productCode"].message?.toString() : ""}
                    {...register("productCode")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormHelperText>Khối lượng</FormHelperText>
                  <OutlinedInput
                    size='small'
                    // label="Khối lượng"
                    placeholder='Nhập khối lượng'
                    fullWidth
                    id="standard-adornment-weight"
                    endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                    aria-describedby="standard-weight-helper-text"
                    inputProps={{
                      'aria-label': 'weight',
                    }}
                    error={!!methods.formState.errors["weight"]}
                    {...register("weight")}
                  />
                  {!!methods.formState.errors["weight"] && (
                    <FormHelperText error id="weight-error">
                      {methods.formState.errors['weight'].message?.toString()}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs>
                  <Grid container>
                    <Grid item xs={12}>
                      <FormHelperText>Trạng thái</FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name={"active"}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <FormControlLabel
                            control={<Switch color="primary"
                              onChange={(event, checked) => onChange(checked)}
                              onBlur={onBlur}
                              checked={value}
                            // inputRef={ref}
                            />}
                            label="Cho phép bán"
                            // labelPlacement="start"
                            // error={!!errors["active"]}
                            // helperText={errors["active"] ? errors["active"].message : ""}
                            {...register("active")}
                          />
                        )}
                      />
                      {!!methods.formState.errors["active"] && (
                        <FormHelperText error id="active-error">
                          {methods.formState.errors['active'].message?.toString()}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </CardStyled>
        </Grid>

        <Grid item xs={4}>
          <CardStyled>
            <CardHeaderStyled
              title={<Title title='Giá sản phẩm' />}
            />

            <CardContent>
              <Grid container direction={"column"} spacing={2}>
                <Grid item xs={12}>
                  <FormHelperText>Giá nhập vào*</FormHelperText>
                  <TextField
                    // label="Tên sản phẩm"
                    id="product-entry-price"
                    size="small"
                    placeholder='Nhập giá nhập vào'
                    fullWidth
                    type='number'
                    error={!!methods.formState.errors["entryPrice"]}
                    helperText={methods.formState.errors["entryPrice"] ? methods.formState.errors["entryPrice"].message?.toString() : ""}
                    {...register("entryPrice")}
                  />
                </Grid>
                <Grid item xs>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText>Giá bán ra*</FormHelperText>
                  <TextField
                    // label="Tên sản phẩm"
                    id="product-sale-price"
                    size="small"
                    placeholder='Nhập giá bán ra'
                    type='number'

                    fullWidth
                    error={!!methods.formState.errors["salePrice"]}
                    helperText={methods.formState.errors["salePrice"] ? methods.formState.errors["salePrice"].message?.toString() : ""}
                    {...register("salePrice")}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </CardStyled>
        </Grid>
        <Grid item xs={8}>

        </Grid>
        <Grid item xs={4}>
          <CardStyled
            sx={{
              minHeight: "210px !important"
            }}
          >
            <CardHeaderStyled
              title={<Title title='Ảnh sản phẩm' />}
            />

            <CardContent>
              <FormProvider {...methods}>
                <UploadImages />
              </FormProvider>

            </CardContent>
          </CardStyled>
        </Grid>
        <Grid item xs>
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
  )
}

export default ProductForm;