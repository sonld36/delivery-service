import { Link } from 'react-router-dom'
import { Box } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { MainLogo } from '@Helpers/export.image';


function Header() {
    return (
        <Box>
            <CssBaseline />
            <Box sx={{
                height: "85px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px !important",
                marginTop: "20px",
            }}>
                <Link to="/shipper">
                    <img alt="Sapo" src={MainLogo} style={{ height: "60px" }} />
                </Link>
            </Box>
        </Box>

    )
}
export default Header