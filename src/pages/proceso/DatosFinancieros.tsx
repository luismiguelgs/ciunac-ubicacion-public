import { Alert, Box, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react'
import * as Yup from 'yup';
import ControlStepper from './ControlStepper';
import { useStateContext } from '../../contexts/ContextProvider';
import { useMask } from '@react-input/mask';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import uploadLogo from '../../assets/upload.svg'
import { MySelect } from '../../components/mui';
import { IfinVal } from '../../interfaces/Ivalidation';
import Upload from '../../components/Upload';

type Props = {
    onSubmit : (values:any) => void
    handleBack : () => void
    activeStep: number
}
const precio  = 30
let myData: any[] = []
const msgReq = 'Campo Requerido'

let validationSchema =  Yup.object<IfinVal>({
    pago: Yup.number().required(msgReq).min(0),
    numero_voucher: Yup.string().trim().when('pago',{
        is: 0,
        then:(schema:Yup.Schema) => schema.optional().nullable(),
        otherwise: (schema:Yup.Schema) => schema.required(msgReq),
    }),
    fecha_pago: Yup.date().when('pago',{
        is: 0,
        then:(schema:Yup.Schema) => schema.optional().nullable(),
        otherwise: (schema:Yup.Schema) => schema.required(msgReq),
    })
})

export default function DatosFinancieros({onSubmit, handleBack, activeStep}:Props) 
{
    //hooks
    const [imageVal, setImageVal] = React.useState<boolean>(false)
    const {data, setData, textos} = useStateContext()
    const voucherRef = useMask({ mask: '_______________', replacement: { _: /\d/ } });

    const formik = useFormik<IfinVal>({
        initialValues: {
            numero_voucher: data.numero_voucher || '' ,
            pago: data.pago,
            fecha_pago:  data.fecha_pago
        },
        validationSchema,
        onSubmit: (values, {resetForm}) => {
            if(data.trabajador && values.pago === 0){
                resetForm()
                onSubmit(values)
            }else{
                if(data.img_voucher === uploadLogo){
                    setImageVal(true)
                }else{
                    onSubmit(values)
                }
            }
        },
    });

    if(data.trabajador){
        myData = [
            {value:(precio - precio*0.8), label:`S/${(precio - precio*0.8).toFixed(2)} - presentar certificado de trabajo(docente)`},
            {value:(precio*0), label:`S/${(precio*0).toFixed(2)} - presentar certificado de trabajo(CAS)`},
        ]
    }else{
        myData = [
            {value:precio, label:`S/${precio.toFixed(2)} - precio normal`},
        ]
    }
    React.useEffect(() => {
        if (formik.values.pago === 0) {
            formik.setFieldValue('numero_voucher', '');
            formik.setFieldValue('fecha_pago', '');
        }
    }, [formik.values.pago]);

    return (
        <Box sx={{ flexGrow: 1, p:1 }} component='form' noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <Alert severity="warning" sx={{mt:1}}>
                        {textos.find(objeto=> objeto.titulo === 'texto_1_pago')?.texto}
                    </Alert>
                    {
                        imageVal ?
                        (
                            <Alert severity="error" sx={{mt:2}} variant='filled' icon={<CloudUploadIcon />}>
                                Completar la subida del archivo al servidor, solo se aceptan formatos *.jpg *.png *.pdf
                            </Alert>
                        ):(
                            <Alert severity="info" sx={{mt:2}} icon={<CloudUploadIcon />}>
                                Luego de buscar el archivo se subirá al servidor para su revisión 
                                se acepta formatos *.jpg *.png *.pdf 
                            </Alert>
                        )
                    }
                </Grid>
                <Grid item xs={12} md={4}>
                    <MySelect 
                        sx={{mb:4, mt:1}}
                        handleChange={formik.handleChange}
                        name='pago'
                        error={formik.touched.pago && Boolean(formik.errors.pago)}
                        value={formik.values.pago}
                        label='Monto pagado'
                        helperText={formik.touched.pago && formik.errors.pago ? formik.errors.pago : ''}
                        data={myData}
                    />
                    <TextField
                        fullWidth
                        inputRef={voucherRef}
                        disabled={formik.values.pago === 0}
                        sx={{mb:4}}
                        required
                        error={formik.touched.numero_voucher && Boolean(formik.errors.numero_voucher)}
                        value={formik.values.numero_voucher}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="numero_voucher"
                        label="Número de Voucher"
                        helperText={ formik.touched.numero_voucher && formik.errors.numero_voucher ? formik.errors.numero_voucher : ''}
                    />
                    <TextField
                        type='date'
                        sx={{mb:4}}
                        required
                        fullWidth
                        disabled={formik.values.pago === 0}
                        error={formik.touched.fecha_pago && Boolean(formik.errors.fecha_pago)}
                        value={formik.values.fecha_pago}
                        onChange={formik.handleChange}
                        name="fecha_pago"
                        onBlur={formik.handleBlur}
                        InputLabelProps={{shrink: true,}}
                        label="Fecha de pago"
                        helperText={ (formik.touched.fecha_pago && formik.errors.fecha_pago) ? (formik.errors.fecha_pago as React.ReactNode) : '' }
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Upload 
                        imagen={data.img_voucher as string}
                        data={data} 
                        setData={setData}
                        ubicacion='vouchers' 
                        titulo='Subir voucher de pago' 
                        prop='img_voucher'/>
                </Grid>
            </Grid>
            <ControlStepper activeStep={activeStep} handleBack={handleBack} steps={3} />
        </Box>
    )
}
