import { Box, Link, Typography } from "@mui/material";
import logoCiunac from '/logo_ciunac.jpg'
import { VERSION } from "../../services/constantes.service";

export default function Copyright() 
{
    return (
        <Box sx={{ my: 1, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <img src={logoCiunac} style={{width:'310px'}} />
            <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                {'Copyright © '}
                <Link color="inherit" href="https://ciunac.unac.edu.pe/">
                    CIUNAC
                </Link>
                {` ${new Date().getFullYear()}. version: ${VERSION}`}
            </Typography>
        </Box>
    )
}
