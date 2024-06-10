import { Alert, Box, Grid } from '@mui/material'
import { useStateContext } from '../../contexts/ContextProvider'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IdocumentVal } from '../../interfaces/Ivalidation';
import Upload from '../../components/Upload';
import ControlStepper from './ControlStepper';
import { useFormik } from 'formik';
import { validationDocuments } from '../../services/validation.service';

type Props = {
    validation: IdocumentVal,
    onSubmit : (values?:any) => void
    activeStep: number,
    setValidation : React.Dispatch<React.SetStateAction<IdocumentVal>>
    handleBack : () => void
}

export default function Documentos({validation,setValidation ,activeStep, handleBack, onSubmit}:Props) 
{
    const {data, setData, textos} = useStateContext()
    const formik = useFormik({
        initialValues: {},
        onSubmit: () => {
            if (validationDocuments(data, setValidation)) {
                onSubmit()
            }
        }
    })

    return (
        <Box sx={{ flexGrow: 1, p:1 }} component='form' onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}> 
                <Grid item xs={12} md={data.trabajador && data.alumno_ciunac ? 4 : 6}>
                    <Alert severity="warning">
                        {textos.find(objeto=> objeto.titulo === 'texto_1_trabajador')?.texto}
                    </Alert>
                    <Alert severity="info" icon={<CloudUploadIcon />} sx={{mt:2}} variant='filled'>
                        Luego de buscar el archivo se subirá al servidor para su revisión 
                         se acepta formatos *.jpg *.png *.pdf
                    </Alert>
                    {
                        validation.cert_ciunac && (
                            <Alert severity="error" variant='filled' sx={{mt:1}} icon={<CloudUploadIcon />}>
                                Subir la imagen del certificado de estudios CIUNAC
                            </Alert>
                        )
                    }
                    {
                        validation.cert_trabajador && (
                            <Alert severity="error" variant='filled' sx={{mt:1}} icon={<CloudUploadIcon />}>
                                Subir la imagen del certificado de trabajador UNAC
                            </Alert>
                        )
                    }
                </Grid>
                {
                    data.trabajador && (
                        <Grid item xs={12} md={data.trabajador && data.alumno_ciunac ? 4 : 6}>
                            <Upload 
                                imagen={data.img_cert_trabajo as string}
                                data={data} 
                                setData={setData} 
                                ubicacion='trabajadores' 
                                prop='img_cert_trabajo' 
                                titulo='Subir Certificado de trabajor UNAC' />
                        </Grid>
                    )
                }
                {
                    data.alumno_ciunac && (
                        <Grid item xs={12} md={data.trabajador && data.alumno_ciunac ? 4 : 6}>
                            <Upload 
                                imagen={data.img_cert_estudio as string}
                                data={data} 
                                setData={setData} 
                                ubicacion='certificados' 
                                prop='img_cert_estudio' 
                                titulo='Subir Certificado de Estudio CIUNAC'/>
                        </Grid>
                    )
                }
            </Grid>
            <ControlStepper activeStep={activeStep} handleBack={handleBack} steps={3}/>
        </Box>
    )
}
