import { useFormik } from 'formik'
import * as Yup from 'yup';
import React from 'react'
import { Alert, Box, Grid, InputAdornment, TextField } from '@mui/material';
import { IstudentVal } from '../../interfaces/Ivalidation';
import { useMask } from '@react-input/mask'
import { useStateContext } from '../../contexts/ContextProvider'
import { MySelect, MySwitch } from '../../components/mui';
import { NIVEL } from '../../services/constantes.service';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Upload from '../../components/Upload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import uploadLogo from '../../assets/upload.svg'
import ControlStepper from './ControlStepper';


const msgReq = 'Campo requerido'
const msgTel = 'Campo de 9 digitos'

type Props = {
    onSubmit : (values:any) => void
    handleBack : () => void
    activeStep: number
}

export default function DatosBasicos({onSubmit, activeStep, handleBack}:Props) 
{
    //hooks
    const [imageVal, setImageVal] = React.useState<boolean>(false)
    const {textos, facultades, cursos, data, setData} = useStateContext()
    
    let validationSchema = Yup.object<IstudentVal>({
        apellidos: Yup.string().required(msgReq).trim(),
        nombres: Yup.string().required(msgReq).trim(),
        idioma: Yup.string().required(msgReq),
        nivel: Yup.string().required(msgReq),
        telefono: Yup.string().required(msgReq).min(11, msgTel).max(11, msgTel),
        alumno: Yup.boolean(),
        facultad: Yup.string().trim().when('alumno',{
            is: true,
            then: (schema:Yup.Schema) => schema.required(msgReq),
            otherwise: (schema:Yup.Schema) => schema.optional().nullable()
        }),
        codigo: Yup.string().when('alumno', {
            is: true,
            then: (schema:Yup.Schema) => schema.required(msgReq),
            otherwise: (schema:Yup.Schema) => schema.optional().nullable()
        })

    })

    const apellidoRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const nombreRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const celularRef = useMask({ mask: '___-___-___', replacement: { _: /\d/ } });
    const codigoRef = useMask({ mask: '__________', replacement: { _: /^[a-zA-Z0-9_]*$/ } });

    const formik = useFormik<IstudentVal>({
        initialValues: { 
            apellidos: data.apellidos,
            nombres: data.nombres,
            idioma: data.idioma,
            nivel: data.nivel,
            telefono: data.telefono,
            alumno: false,
            facultad: data.facultad,
            codigo: data.codigo || ''
        },
        validationSchema,
        onSubmit: values => { 
            if(data.img_dni === uploadLogo){
                setImageVal(true)
            }else{
                onSubmit(values)
            }
        }
    })    

    return (
        <React.Fragment>
            <Box component='form' onSubmit={formik.handleSubmit} sx={{flexGrow: 1, p:1}} noValidate autoComplete='off'>
                <Grid container spacing={2}>
                    <Grid container item spacing={1} xs={12} md={8}>
                        <Grid item xs={12}>
                            <Alert severity="warning">
                                {textos.find(objeto=> objeto.titulo === 'texto_ubicacion_2')?.texto}
                            </Alert>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                inputRef={apellidoRef}
                                required
                                fullWidth
                                name='apellidos'
                                onBlur={formik.handleBlur}
                                error={formik.touched.apellidos && Boolean(formik.errors.apellidos)}
                                value={formik.values.apellidos}
                                onChange={formik.handleChange}
                                label="Apellidos"
                                sx={{m:1}}
                                helperText={formik.touched.apellidos && formik.errors.apellidos ? formik.errors.apellidos : ''}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <TextField
                                inputRef={nombreRef}
                                required
                                fullWidth
                                name='nombres'
                                onBlur={formik.handleBlur}
                                error={formik.touched.nombres && Boolean(formik.errors.nombres)}
                                value={formik.values.nombres}
                                onChange={formik.handleChange}
                                label="Nombres"
                                sx={{m:1}}
                                helperText={formik.touched.nombres && formik.errors.nombres ? formik.errors.nombres : ''}
                            />
                        </Grid> 
                        <Grid item xs={12} md={6}>
                            <MySelect 
                                name="idioma"
                                label="Idioma"
                                sx={{m:1}}
                                value={formik.values.idioma}
                                handleChange={formik.handleChange}
                                helperText="Seleccionar el idioma"
                                data={cursos}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MySelect 
                                name="nivel"
                                label="Nivel"
                                sx={{m:1}}
                                disabled={!data.alumno_ciunac}
                                value={formik.values.nivel}
                                handleChange={formik.handleChange}
                                helperText="Seleccionar el nivel"
                                data={NIVEL}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                inputRef={celularRef}
                                required
                                fullWidth
                                sx={{m:1}}
                                name='telefono'
                                onBlur={formik.handleBlur}
                                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                type='text'
                                label="Celular"
                                InputProps={{
                                    inputMode: 'numeric',
                                    startAdornment: (<InputAdornment position="start"><WhatsAppIcon /></InputAdornment>),
                                }}
                                variant="outlined"
                                helperText={formik.touched.telefono && formik.errors.telefono ? formik.errors.telefono : ''}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MySwitch 
                                handleChange={formik.handleChange}
                                checked={formik.values.alumno as boolean}
                                sx={{m:1}}
                                name='alumno'
                                label='Marcar si es alumno/egresado de la UNAC'
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MySelect 
                                disabled={!formik.values.alumno}
                                name="facultad"
                                label="Facultad"
                                value={formik.values.facultad}
                                handleChange={formik.handleChange}
                                helperText="Seleccionar facultad"
                                data={facultades}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                inputRef={codigoRef}
                                disabled={!formik.values.alumno}
                                fullWidth
                                error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                                name="codigo"
                                onBlur={formik.handleBlur}
                                label="Código de Alumno"
                                value={data.codigo}
                                onChange={formik.handleChange}
                                helperText={formik.touched.codigo && formik.errors.codigo ? formik.errors.codigo : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        {
                            imageVal ? (<Alert icon={<CloudUploadIcon />} severity="error" variant='filled'>
                                Subir la imagen del DNI, solo se aceptan formatos *.jpg *.png *.pdf
                            </Alert>) :
                            (<Alert icon={<CloudUploadIcon />} severity="info" variant='outlined'>
                            Luego de buscar el archivo se subirá al servidor para su revisión 
                             se acepta formatos *.jpg *.png *.pdf
                            </Alert>)
                        }
                    </Grid> 
                    </Grid>  
                    <Grid container item spacing={2} xs={12} md={4}>
                        {/*Upload*/}
                        <Grid item xs={12}>
                            <Upload 
                                imagen={data.img_dni as string}
                                data={data} 
                                setData={setData} 
                                ubicacion='dnis' 
                                prop='img_dni' 
                                titulo='Subir Imagen DNI'/>
                        </Grid>
                    </Grid>
                </Grid>
                <ControlStepper activeStep={activeStep} handleBack={handleBack} steps={3}/>
            </Box>
        </React.Fragment>
    )
}
