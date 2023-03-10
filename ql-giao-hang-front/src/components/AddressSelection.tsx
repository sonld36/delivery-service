import { ProvinceCommonType } from '@Common/types'
import { checkSeprateList, getAddressByCode } from '@Helpers/list.handle'
// import { recognizeProvince } from '@Helpers/string.handler'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import provinceService from '@Services/province.service'
import React, { useEffect, useState } from 'react'
import { Control, Controller, ControllerRenderProps } from 'react-hook-form'

const stateAddress: {
  [key: number]: string
} = {
  0: "Tỉnh",
  1: "Quận/Huyện",
  2: "Phường/Xã"
}

type Props = {
  control: Control<any>
}


function AddressSelection(props: Props) {

  const { control } = props;

  const [options, setOptions] = useState<ProvinceCommonType[]>([]);
  const [address, setAddress] = useState<ProvinceCommonType[]>([]);
  const [placeholder, setPlaceholder] = useState<string>(stateAddress[0]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getProvice = async () => {
      setLoading(true);
      const provinces: ProvinceCommonType[] = await provinceService.getAllProvince();
      setOptions(provinces);
      setLoading(false);
    }

    const getDistrict = async () => {
      setLoading(true);
      const provinceCode = address[0].code;
      const districts: ProvinceCommonType[] = await provinceService.getDistrictByProvinceCode(provinceCode);
      const newDistrict: ProvinceCommonType[] = getAddressByCode(districts, provinceCode, "province_code");
      setOptions(newDistrict);
      setLoading(false);
    }

    const getWard = async () => {
      setLoading(true);
      const districtCode = address[1].code;
      const wards: ProvinceCommonType[] = await provinceService.getWardByDistrictCode(districtCode);
      const newWards: ProvinceCommonType[] = getAddressByCode(wards, districtCode, "district_code");
      setOptions(newWards);
      setLoading(false);
    }

    setPlaceholder(stateAddress[address.length]);

    if (address.length === 0) {
      getProvice();
    } else if (address.length === 1) {
      getDistrict()
    } else if (address.length === 2) {
      getWard();
    } else {
      setOptions([]);
    }
  }, [address]);


  const onChangeHandler = (field?: ControllerRenderProps<any, "address">, data?: ProvinceCommonType[]) => {
    const checked = data ? checkSeprateList(data) : [];
    field?.onChange(checked);
    setAddress(checked);
  }

  return (
    <Controller
      control={control}
      name="address"
      rules={{ required: true }}
      render={({ field, formState }) => (
        <Autocomplete
          {...field}
          {...formState}
          multiple
          id="tags-standard"
          options={options}
          fullWidth
          getOptionLabel={(option) => option.name}
          disabled={loading}
          onChange={(_, data) => {
            onChangeHandler(field, data);
          }}
          value={field.value}
          loading={loading}
          limitTags={3}
          renderInput={(params) => (
            <TextField
              {...params}
              // variant="standard"
              placeholder={placeholder}
              required
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              error={!!formState.errors["address"]}
              helperText={formState.errors["address"] ? formState.errors["address"].message?.toString() : ""}
            // {...control.register("address")}
            />
          )}
        />
      )
      }
    />
  )
}


export default AddressSelection;