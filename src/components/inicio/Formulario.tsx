import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider'
import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email';
import Warning from './Warning'
import { useMask } from '@react-input/mask'
import ReCAPTCHA from 'react-google-recaptcha'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Copyright from './Copyright';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { IbasicVal } from '../../interfaces/Ivalidation';

type Props = {
    handleClick():void
    captchaRef: React.LegacyRef<ReCAPTCHA>
}

const msgReq = 'Campo Requerido'
const msgDni = 'Campo de 8 caracteres'
const emailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 

let validationSchema = yup.object<IbasicVal>({
    dni: yup.string().required(msgReq).trim().min(8, msgDni).max(8, msgDni),
    email: yup.string().required(msgReq).matches(emailRegex, 'Ingrese un correo electrónico válido')
})

export default function Formulario({handleClick, captchaRef}:Props) 
{
    //hooks ***
    const {setData, textos} = useStateContext()

    const dniRef = useMask({ mask: '________', replacement: { _: /\d/ } });

    const formik = useFormik<IbasicVal>({
        initialValues:{
            dni: '',
            email: '',
            alumno_ciunac: false,
            trabajador: false
        },
        validationSchema,
        onSubmit: (values)=> {
            setData((prevFormData)=>({
                ...prevFormData, 
                email:values.email, 
                dni:values.dni,
                trabajador:values.trabajador,
                alumno_ciunac: values.alumno_ciunac
            }))
            handleClick() 
        }
    })

    return (
        <Box component="form" sx={{p:2}} noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    <Box sx={{margin:'0 auto'}}>
                        
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField      
                        required
                        name='email'
                        fullWidth
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        label="Email"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>),
                        }}
                        variant="outlined"
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        inputRef={dniRef}
                        required
                        fullWidth
                        error={formik.touched.dni && Boolean(formik.errors.dni)}
                        value={formik.values.dni}
                        onChange={formik.handleChange}
                        name="dni"
                        label="DNI"
                        helperText={formik.touched.dni && formik.errors.dni}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Warning
                        texto={textos.find(objeto=> objeto.titulo === 'texto_1_inicio')?.texto}
                        checked={formik.values.trabajador}
                        handleChange={formik.handleChange}
                        label="Trabajador UNAC"
                        mensaje="Hacer click si usted es trabajador."
                        name="trabajador" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Warning
                        texto={textos.find(objeto=> objeto.titulo === 'texto_ubicacion_1')?.texto}
                        checked={formik.values.alumno_ciunac}
                        handleChange={formik.handleChange}
                        label="Alumno CIUNAC (CENTRO DE IDIOMAS UNAC)"
                        mensaje="Hacer click si usted es alumno de CIUNAC."
                        name="alumno_ciunac" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ alignContent:'center',alignItems:'center', p:3, display:'flex', flexDirection:'column'}} >
                        <ReCAPTCHA sitekey={import.meta.env.VITE_APP_SITE_KEY} ref={captchaRef} />
                        <Button type='submit' variant="contained" size="large" endIcon={<PlayCircleFilledIcon />} sx={{m:3}}>
                            Avanzar
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12}  sm={6}>
                    <Copyright />
                </Grid>
            </Grid>
        </Box>
    )
}
