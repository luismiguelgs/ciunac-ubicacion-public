import { Alert, Box, Button } from '@mui/material'
import pdf from '../assets/pdf.png'
import Disclamer from '../components/final/Disclamer'
import { useStateContext } from '../contexts/ContextProvider'
import PDFService from '../services/pdf.service'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function Finish() 
{
    const { textos, data } = useStateContext()

    const exportPDF = () => {
        const blobPdf = PDFService.exportarCargoUbicacion(textos,{
            solicitud:data.tipo_solicitud,
            creado:new Date().toLocaleString(),
            apellidos: data.apellidos,
            nombres: data.nombres,
            dni: data.dni,
            idioma: data.idioma,
            nivel: data.nivel,
            pago:data.pago,
            voucher:data.numero_voucher
        }, false)

        const blobUrl = URL.createObjectURL(blobPdf);

        // Crear un enlace (hipervínculo) invisible
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = blobUrl
        a.download = `${data.dni}-${data.idioma}-${data.nivel}.pdf`

        // Agregar el enlace al documento y hacer clic para iniciar la descarga
        document.body.appendChild(a);
        a.click();

        // Limpiar el enlace después de la descarga
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    }

    return (
        <Box sx={{m:3}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Alert sx={{mt:2, mb:2}}  severity='error'>
					Se ha completado el procedimiento puede descargar su cargo! para presentarlo de manera física, para rendir su examen!
				</Alert>
				<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<img src={pdf} alt='pdf' width='50px' style={{margin:'5px'}} onClick={exportPDF}></img>
					<Button color="success" variant="contained" onClick={exportPDF} autoFocus disabled={false} endIcon={<CloudDownloadIcon />} >
						Descargar Cargo
					</Button>
				</div>
			</Box> 
           <Disclamer textoFinal={true} />
        </Box>
    )
}
