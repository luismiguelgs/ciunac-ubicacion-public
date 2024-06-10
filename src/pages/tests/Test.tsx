import { Box, Step, StepLabel, Stepper } from '@mui/material'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import DatosBasicos from './DatosBasicos'
import DatosFinancieros from './DatosFinancieros'
import Documentos from './Documentos'
import { useStateContext } from '../../contexts/ContextProvider'
import IsolUbicacion from '../../interfaces/IsolUbicacion'
import { IdocumentVal } from '../../interfaces/Ivalidation'
import Final from './Final'

type MyStep = {
    label: string,
    component: React.ReactNode,
    route: string
}
let steps:MyStep[] = []
const proceso = 'test'

export default function Test() 
{
    //hooks
    const navigate = useNavigate()
    const location = useLocation()
    
    const {data, setData} = useStateContext()
    //página de documentos
    const [docsVal, setDocsVal] = React.useState<IdocumentVal>({cert_trabajador: false, cert_ciunac: false})

    React.useEffect(()=>{
        const precio = 30//certificados.filter((cer)=> cer.value === data.solicitud)[0].precio
        if(data.trabajador){
          setData((prevData)=>({...prevData, pago:(precio-precio*0.8)}))
        }else{
          setData((prevData)=>({...prevData, pago:precio}))
        }
    },[data.trabajador])

    const getCurrentStep = () =>{
        switch (location.pathname) {
            case `/${proceso}/paso-1`:
                return 0
            case `/${proceso}/paso-2`:
                return 1
            case `/${proceso}/paso-3`:
                if(steps.length > 3) {
                    return 2
                }else{
                    return -1
                }
            case `/${proceso}/final`:
                if(steps.length > 3){
                    return 3
                }else{
                    return 2
                }
            default:
                return 0
        }
    }
    const handleNext = (values:IsolUbicacion) => {
        const currentStep = getCurrentStep()
        
        switch (currentStep){
            case 0:
                setData((prevFormData)=>({
                    ...prevFormData, 
                    apellidos:values.apellidos,
                    nombres: values.nombres,
                    codigo: values.codigo,
                    facultad: values.facultad,
                    idioma: values.idioma,
                    nivel: values.nivel,
                    telefono: values.telefono
                }))
                break
            case 1:
                setData((prevFormData)=>({
                    ...prevFormData, 
                    numero_voucher: values.numero_voucher,
                    pago: values.pago,
                    fecha_pago: values.fecha_pago
                }))
                break
            case 2:
                console.log(values);
                break
            default:
                break
        }


        if(currentStep < steps.length -2){
            console.log(steps.length);
            navigate(`/${proceso}/paso-${currentStep + 2}`)
        }else{
            navigate(`/${proceso}/final`)
            console.log(data);
        }
    }
    const handleBack = () =>{
        const currentStep = getCurrentStep()
        if(currentStep > 0){
            navigate(`/${proceso}/paso-${currentStep}`)
        }
    }
    steps = [
        {   
            label: 'Información Básica', 
            component: (<DatosBasicos onSubmit={handleNext} handleBack={handleBack} activeStep={getCurrentStep()} />), 
            route:'/paso-1'
        },
        {   
            label: 'Información De pago', 
            component: (<DatosFinancieros onSubmit={handleNext} handleBack={handleBack} activeStep={getCurrentStep()} />), 
            route:'/paso-2'
        },
    ]

    if(data.alumno_ciunac || data.trabajador){
        steps.push({
            label:"Certificados", 
            component:(<Documentos activeStep={getCurrentStep()} validation={docsVal} handleBack={handleBack}/>), 
            route:'/paso-3'
        }, {
            label:'Paso final',
            component:(<Final data={data} handleBack={handleBack} />),
            route: '/final'
        })
    }else{
        steps.push({
            label:'Paso final',
            component:(<Final data={data} handleBack={handleBack}/>),
            route: '/final'
        })
    }

    return (
        <Box width='100%' p={2}>
            <Stepper activeStep={getCurrentStep()} alternativeLabel>
                {
                    steps.map((item, index)=>(
                        <Step key={index}>
                            <StepLabel>{item.label}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>        
            <Routes>
                {
                    steps.map((item, index) => (
                        <Route key={index} path={item.route} element={item.component} />
                    ))
                }
                <Route path='/' element={steps[0].component} />
            </Routes>    
        </Box>
    )
}
