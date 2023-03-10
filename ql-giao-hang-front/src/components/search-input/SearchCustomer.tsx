import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { useDebounce } from '@Helpers/hooks';
import customerService from '@Services/customer.service';
import { AddressToSave, CustomerType } from '@Common/types';
import { useFormContext, Controller } from 'react-hook-form'
import { UseFieldArrayReturn } from 'react-hook-form/dist/types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Typography from '@mui/material/Typography';


const fetchData = async (searchQuery: string) => {
  const resp = await customerService.searchByPhoneNumber(searchQuery);
  return resp.data;
}

const isOptionEqualToValue = (option: CustomerType<AddressToSave[]>, value: CustomerType<AddressToSave[]>) => {

  return option.phoneNumber === value.phoneNumber
}
const getOptionLabel = (option: CustomerType<AddressToSave[]>) => {
  return option.phoneNumber;
}

const renderOption = (props: any, option: CustomerType<AddressToSave[]>) => {
  return (
    <li {...props}>
      <Grid container alignItems="center">
        <Grid item sx={{ display: 'flex', width: 44 }}>
          <PersonPinIcon sx={{ color: 'text.secondary' }} />
        </Grid>
        <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
          <Box

            component="span"
            sx={{ fontWeight: 'bold' }}
          >
            {option.phoneNumber}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {option.name}
          </Typography>
        </Grid>
      </Grid>
    </li>
  )
}

export default function SearchCustomer() {

  const methods = useFormContext();

  const {
    control,
  } = methods


  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<CustomerType<AddressToSave[]>[]>([]);
  const loading = open && options.length === 0;

  //start
  const [query, setQuery] = React.useState('');
  const controllerRef: React.MutableRefObject<AbortController | undefined> = React.useRef();

  const searchQuery = useDebounce(query, 300);

  const controller = new AbortController();

  controllerRef.current = controller;

  const search = async () => {
    setOpen(true);
    const data = await fetchData(searchQuery);

    setOptions(data);
  }

  React.useEffect(() => {
    if (searchQuery) {
      search();
    }

    return () => {
      controllerRef.current?.abort();
    }

  }, [searchQuery]);


  React.useEffect(() => {
    if (!open) {
      setOptions([]);
      setQuery('');
    } else {
      search();
    }
  }, [open]);

  // const handleChangeProduct = (data: )

  return (
    <Controller
      control={control}
      name={"customer"}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          id="search"
          sx={{ width: '100%' }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
            setQuery('');
          }}
          size="small"
          isOptionEqualToValue={(option, value) => isOptionEqualToValue(option, value)}
          getOptionLabel={(option) => getOptionLabel(option)}
          onInputChange={(event, newInputValue) => { setQuery(newInputValue) }}
          options={options}
          loading={loading}
          onChange={(event, value) => {
            onChange(value);
          }}
          value={value || null}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                value={query}
                placeholder={"Tìm theo số điện thoại"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {/* {params.InputProps.endAdornment} */}
                    </React.Fragment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start" sx={{
                      textAlign: 'center'
                    }}>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            )
          }}

          renderOption={(props, option) => renderOption(props, option)}

        />
      )}
    />
  );
}
