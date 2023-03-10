import { ConvertProductInOrderByDP, ProductInOrderByDP } from '@Common/types';
import DisplayImage from '@Components/DisplayImage';
import { defaultImageUploadState } from '@Components/UploadImages';
import { selectFile } from '@Helpers/image.handle';
import fileService from '@Services/file.service';
import orderService from '@Services/order.service';
import { Box, Divider, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { NumericFormat } from 'react-number-format';

function OrderProdcutDetail(props: { maVanDon: number }) {

    const [orderProductDetail, setOrderProductDetail] = React.useState<ProductInOrderByDP[]>([]);
    const [orderProductDetailConvert, setOrderProductDetailConvert] = React.useState<ConvertProductInOrderByDP[]>([]);

    const { maVanDon } = props;
    const [stt, setSTT] = React.useState(1);
    const [ship_fee, setShip_fee] = React.useState(30000);
    const [type, setType] = React.useState("PAID");

    //Them thuoc tinh tinh gia tinh san pham

    //Ham tinh tong tat ca san pham
    const toTotalPrice = (items: readonly ConvertProductInOrderByDP[]) => {
        return items.map(({ totalPrice }) => totalPrice).reduce((sum, i) => sum + i, 0);
    }
    const totalPrice = toTotalPrice(orderProductDetailConvert)

    //Lay data tu api
    const fetchGetProductInfDetail = async () => {
        try {
            let resp: any = await orderService.getProductInfDetail(maVanDon);
            if (resp && resp.code === 2000) {
                setShip_fee(resp.data.deliveryFee);
                setType(resp.data.type);
                setOrderProductDetail(resp.data.products)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    React.useEffect(() => {
        fetchGetProductInfDetail();
    }, [])
    React.useEffect(() => {

        const temp: ConvertProductInOrderByDP[] = []
        orderProductDetail.map(async (product: ProductInOrderByDP) => {
            const image = await fileService.getImage(product.pathImage);
            const tmp = new File([image], product.pathImage);
            const imageSelect = selectFile(tmp, defaultImageUploadState);
            temp.push({ product, totalPrice: (product.productQuantity * product.productPrice), image: imageSelect })
        })
        setOrderProductDetailConvert(temp)
    }, [orderProductDetail])

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={6}>
                    <Grid container>
                        <Box sx={{ padding: "5px", borderRadius: "8px", overflow: "auto", width: "100%" }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ overflow: "auto" }} size="medium" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ width: "10px" }}>STT</TableCell>
                                            <TableCell align="center" >Ảnh</TableCell>
                                            <TableCell align="left">Tên sản phẩm</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderProductDetailConvert.map((row, index) => (
                                            <TableRow
                                                key={row.product.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align='center'>{index + 1}</TableCell>
                                                <TableCell align="center"><DisplayImage style={{
                                                    width: "50px",
                                                    height: "50px"
                                                }} src={row.image.previewImage ? row.image.previewImage : ""} /></TableCell>
                                                <TableCell align="left">{row.product.name}</TableCell>
                                                <TableCell align="center">{row.product.productQuantity}</TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                    <Grid component={Paper} container sx={{ height: "200px", padding: "5px" }}>
                        <Box sx={{ padding: "5px", borderRadius: "8px", overflow: "auto", width: "100%", backgroundColor: "white", display: "inline-grid" }}>
                            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                <Grid container xs={12} >
                                    <Grid item xs={8}>
                                        <Typography>Tổng tiền &nbsp;({orderProductDetailConvert.length} sản phẩm)</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography><NumericFormat value={totalPrice * 110 / 100} displayType={'text'} thousandSeparator={true} /></Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                <Grid container xs={12} >
                                    <Grid item xs={8}>
                                        <Typography>Khách đã trả ({type})</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography><NumericFormat value={type === "PAID" ? totalPrice : 0} displayType={'text'} thousandSeparator={true} /></Typography>
                                    </Grid>
                                </Grid>     
                            </Grid>
                            <Grid item xs={12}  >
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                <Grid container xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                    <Grid item xs={8}>
                                        <Typography>Phí giao hàng</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <NumericFormat value={ship_fee} displayType={'text'} thousandSeparator={true} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                <Grid container xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                    <Grid item xs={8}>
                                        <Typography>Khách hàng phải trả </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <NumericFormat value={type === "COD" ? (totalPrice * 110 / 100 + ship_fee) : ship_fee} displayType={'text'} thousandSeparator={true} />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>
                </Grid>
            </Grid >



        </React.Fragment >
    );
}
export default OrderProdcutDetail;
