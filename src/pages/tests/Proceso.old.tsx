import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider'
import { IdocumentVal, IfinVal, IstudentVal } from '../../interfaces/Ivalidation';
import { validationDocuments, validationFinData, validationStudentData, validationUploadImage } from '../../services/validation.service';
import DatosBasicos from '../../components/proceso/DatosBasicos';
import { Box } from '@mui/material';
import { MySnackBar, MyStepper } from '../../components/mui';
import { MyStep } from '../../components/mui/MyStepper';
import Final from '../../components/proceso/Final';
import Documentos from '../../components/proceso/Documentos';
import DatosFinancieros from '../../components/proceso/DatosFinancieros';

export default function Proceso() 
{
    const {data, setData} = useStateContext()

    const [open, setOpen] = React.useState(false); //snackbar

    //página de datos básicos ******************************************************************************
    const [basicVal, setBasicVal] = React.useState<IstudentVal>({apellidos:false, nombres:false, celular:false, codigo:false, imagen:false})
    //datos de alumno unac
    const [checked, setChecked] = React.useState<boolean>(false)

    //página de documentos ********************************************************************************
    const [docsVal, setDocsVal] = React.useState<IdocumentVal>({cert_trabajador: false, cert_ciunac: false})
    
    //página de datos financieros **********************************************************************
    const [finVal, setFinVal] = React.useState<IfinVal>({imagen:false, voucher:false, fecha:false,pago:false})

    React.useEffect(()=>{
        const precio = 30//certificados.filter((cer)=> cer.value === data.solicitud)[0].precio
        if(data.trabajador){
          setData((prevData)=>({...prevData, monto:(precio-precio*0.8)}))
        }else{
          setData((prevData)=>({...prevData, monto:precio}))
        }
      },[data.trabajador])

    // Control del Stepper *************************************************************************
    const [activeStep, setActiveStep] = React.useState<number>(0)
    const [skipped, setSkipped] = React.useState(new Set<number>())

    const isStepSkipped = (step:number) => {
        return skipped.has(step)  
    }

    const handleNext = () => {
        let newSkipped = skipped
        if(isStepSkipped(activeStep)){
          newSkipped = new Set(newSkipped.values())
          newSkipped.delete(activeStep)
        }
        //validar antes de pasar al proceso siguiente
        switch (activeStep) {
          case 0:
            if (validationStudentData(data,checked,setBasicVal) && validationUploadImage(data.img_dni)) {
              //if(!checked) setData((prevFormData)=>({...prevFormData, facultad:''}))
              setOpen(false)
              setActiveStep((prevActiveStep) => prevActiveStep + 1)
              setSkipped(newSkipped)
            } else{
              setOpen(true)
            }
          break;
          case 1:
            if (validationFinData(data,setFinVal)) {
              setOpen(false)
              setActiveStep((prevActiveStep) => prevActiveStep + 1)
              setSkipped(newSkipped)

            }else{
              setOpen(true)
            }
          break
          case 2:
            if (validationDocuments(data, setDocsVal)) {
              setActiveStep((prevActiveStep) => prevActiveStep + 1)
              setSkipped(newSkipped)
              setOpen(false)
            }else{
                setOpen(true)
            }
          break
          default:
          break;
        }  
    }
    
    const stepFinish = (
        <Final
          setActiveStep={setActiveStep}
          data={data} 
          //constancia={constanciaTU}
        />
    )

    const stepBasicData = (
        <DatosBasicos
          data={data} 
          setData={setData}
          validation={basicVal} 
          checked={checked}
          setChecked={setChecked} />
    )
    const stepInfoFinanciera = (
        <DatosFinancieros open={open} setOpen={setOpen} validation={finVal}/>
    )

    const stepComponents:MyStep[] = [
        {caption:"Información Básica", component:stepBasicData, optional:false},
        {caption:'Información Financiera', component: stepInfoFinanciera, optional:false}
    ]
    if(data.alumno_ciunac || data.trabajador){
        stepComponents.push({caption:"Certificados", component:<Documentos validation={docsVal} />, optional:false})
    }

    return (
        <Box sx={{width:'100%', p:2}}>
            <MyStepper 
            stepComponents={stepComponents}
            activeStep={activeStep} 
            setActiveStep={setActiveStep}
            skipped={skipped} 
            setSkipped={setSkipped}
            handleNext={handleNext}
            stepFinish={stepFinish}
            />
            <MySnackBar
                open={open}
                setOpen={setOpen}
                severity='error'
                content='Ingresar los datos solicitados'
            />
        </Box>
    )
}
