import { ProductInOrder, ProductType } from '@Common/types';
import { useDebounce } from '@Helpers/hooks';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import shopService from '@Services/shop.service';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { convertNumberToCurrency } from '@Helpers/data.optimize';



const isOptionEqualToValue = (option: ProductInOrder, value: ProductInOrder) => {

  return option.id === value.id;
}
const getOptionLabel = (option: ProductInOrder) => {
  return option.name;
}

const renderOption = (props: any, option: ProductInOrder) => {
  return (
    <li {...props} key={option.id}>
      <Grid container alignItems="center">
        <Grid item sx={{ display: 'flex', width: 44 }}>
          <Inventory2Icon sx={{ color: 'text.secondary' }} />
        </Grid>
        <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
          <Box

            component="span"
            sx={{ fontWeight: 'bold' }}
          >
            {option.name}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {convertNumberToCurrency(option.salePrice)}
          </Typography>
        </Grid>
      </Grid>
    </li>
  )
}


const fetchData = async (searchQuery: string) => {
  const resp = await shopService.searchProduct(searchQuery);
  return resp.data;
}
export default function SearchProduct() {

  const methods = useFormContext();

  const {
    control,
    watch
  } = methods;

  const watchProduct = watch("products", []);

  // console.log("watchProduct", watchProduct);


  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ProductType[]>([]);
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
      name={"products"}
      render={({ field: { onChange } }) => (
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
          onChange={(event, value, reason) => {
            onChange(value);
          }}
          value={watchProduct}
          multiple
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                // value={query}
                placeholder={"Tìm kiếm sản phẩm"}
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
