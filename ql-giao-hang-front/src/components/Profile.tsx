import { ResponseReceived, ShopProfile } from '@Common/types';
import { partnersRegistrationSchema } from '@Helpers/form.validate';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { CardMedia, Container, Fab } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import shopService from '@Services/shop.service';
import { useEffect, useState } from 'react';
import { TypeOf } from 'zod';
import Title from './Title';
import { CardHeaderStyled } from './Utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AddressSelection from './AddressSelection';
import provinceService from '@Services/province.service';
import { shopStatus } from '@Common/const';

type ProfileType = TypeOf<typeof partnersRegistrationSchema>;


function Profile() {
  const [profile, setProfile] = useState<ShopProfile>();
  // const [dataToEdit, setDataToEdit] = useState<ProfileType>();

  const methods = useForm<ProfileType>({
    resolver: zodResolver(partnersRegistrationSchema),
    async defaultValues(payload) {
      const resp: ResponseReceived<ShopProfile> = await shopService.getProfileShop();
      const { data } = resp;
      const province = await provinceService.getProvince(data.addresses[0].provinceCode);
      const district = await provinceService.getDistrict(data.addresses[0].districtCode);
      const ward = await provinceService.getWard(data.addresses[0].wardCode);

      const values: any = {
        address: [
          province,
          district,
          ward
        ],
        addressDetail: data.addresses[0].addressDetail,
        phoneNumber: data.account.phoneNumber,
        name: data.account.name
      }
      setProfile(data);

      return values;
    },
  });

  const { register, control } = methods;


  return (
    <>
      <Container>
        <Card sx={{
          padding: "20px 40px"
        }}>
          <Grid container direction={"row"} spacing={25}>
            <Grid
              item
              xs={2}
              // lg={4}
              className='avatar'>
              <Card sx={{
                width: "fit-content",
                position: "relative"
              }}>
                <CardMedia
                  component="img"
                  // height="194"
                  image="https://play-lh.googleusercontent.com/tYMp9pS-XfxRCO_6a1kbwDn5KiGnM-__eFgQ9gbz3MBPxp2sitUwYhn5WumCnH7ppA=w240-h480-rw"
                  alt="Paella dish"
                  sx={{
                    width: "200px",
                    height: "auto"
                  }}

                />
                <CardActions sx={{
                  position: "absolute",
                  right: 0,
                  bottom: 0
                }}>
                  <Fab color="success" aria-label="add" size='small'>
                    <SettingsApplicationsIcon />
                  </Fab>
                </CardActions>
              </Card>

            </Grid>

            <Grid item xs={10}>
              <CardHeaderStyled
                title={<Title title='Th??ng tin c?? nh??n' />}
              />

              <Container sx={{
                padding: "30px 10px"
              }}>
                <Grid container direction={"column"} spacing={4}>
                  <Grid item xs={12}>
                    <Grid container direction={"row"} spacing={4}>
                      <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth disabled>
                          <InputLabel htmlFor="component-disabled">T??n t??i kho???n</InputLabel>
                          <Input id="component-disabled" value={profile ? profile.account.username : ""} placeholder='T??n t??i kho???n' />
                        </FormControl>
                      </Grid>

                      <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel htmlFor="component-simple">T??n shop</InputLabel>
                          <Input id="component-simple" placeholder='T??n shop'
                            value={profile ? profile.account.name : ""}
                            {...register("name")}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction={"row"} spacing={4}>
                      <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel htmlFor="component-phoneNumber">S??? ??i???n tho???i</InputLabel>
                          <Input id="component-phoneNumber" placeholder='S??? ??i???n tho???i'
                            value={profile ? profile.account.phoneNumber : ""}
                            {...register("phoneNumber")}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth disabled>
                          <InputLabel htmlFor="component-disabled">Tr???ng th??i</InputLabel>
                          <Input id="component-disabled" value={profile?.status.toString() === 'ACCEPTED' ? shopStatus.ACCEPTED : shopStatus.REGISTERING} placeholder='Tr???ng th??i' />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel htmlFor="component-address-detail">?????a ch??? chi ti???t</InputLabel>
                      <Input id="component-address-detail" placeholder='?????a ch??? chi ti???t'
                        value={profile ? profile.addresses[0].addressDetail : ""}
                        {...register("addressDetail")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl variant="standard" fullWidth>
                      <AddressSelection control={control} />

                    </FormControl>
                  </Grid>
                </Grid>

              </Container>
            </Grid>

          </Grid>
        </Card>
      </Container>
    </>
  )
}

export default Profile