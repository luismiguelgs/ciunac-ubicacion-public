import { Box, Button, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import DialogAlert from "./DialogAlert";

export type MyStep = {
    caption: string,
    component: React.ReactNode,
    optional: boolean,
    optParam?: boolean
}

type Props = {
    stepFinish?:React.ReactNode,
    stepComponents: MyStep[]
    activeStep:number,
    skipped: Set<number>,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>,
    setSkipped: React.Dispatch<React.SetStateAction<Set<number>>>,
    handleNext(): void,
}

export default function MyStepper({stepFinish=null, activeStep, skipped, stepComponents,setActiveStep, setSkipped, handleNext}:Props) 
{

    //estado del alert
    const [openA, setOpenA] = React.useState(false);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  
    const handleSkip = () => {
        if(isStepOptional(activeStep) && stepComponents[activeStep]?.optParam){
            setOpenA(true)
            return
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
  
        setSkipped((prevSkipped)=>{
            const newSkipped = new Set(prevSkipped.values())
            newSkipped.add(activeStep)
            return newSkipped
        })
    }
    const isStepOptional = (step:number):boolean => {
        return stepComponents[step].optional
    }
    const isStepSkipped = (step:number) => {
        return skipped.has(step)
    }

    return (
        <React.Fragment>
            <Stepper activeStep={activeStep} alternativeLabel>
            {
                stepComponents.map((component,index) => {
                    const stepProps: {completed? : boolean} = {}
                    const labelProps : {opcional? : React.ReactNode} = {}

                    if(isStepOptional(index)){
                        labelProps.opcional = (<Typography variant='caption'>Opcional</Typography>)
                    }
                    if(isStepSkipped(index)){
                        stepProps.completed = false
                    }
                    return(
                    <Step key={component.caption}{...stepProps}>
                        <StepLabel {...labelProps}>{component.caption}</StepLabel>
                    </Step>
                    )
                })
            }
        </Stepper>
        {
          activeStep === stepComponents.length ? (stepFinish) : 
          (
            <React.Fragment>
              { stepComponents[activeStep].component}

                <Box sx={{display:'flex', flexDirection:'row',pt:1}}>
                    <Button
                        color='primary' 
                        disabled={activeStep === 0} 
                        onClick={handleBack} 
                        sx={{mr:1}} 
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}>
                        REGRESAR
                    </Button>
                    <Box sx={{flex:'1 1 auto'}}>
                    {
                        isStepOptional(activeStep) && (
                        <Button color='secondary' onClick={handleSkip} sx={{mr:1}} variant="outlined">
                            OMITIR
                        </Button>
                        )
                    }
                    </Box>
                    <Button 
                        color="primary" 
                        onClick={handleNext} 
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}>
                        {activeStep === stepComponents.length - 1 ? 'TERMINAR':'SIGUENTE'}
                    </Button>
                </Box>
                <DialogAlert 
                    title='Paso opcional' 
                    content='Ha marcado este paso como no opcional' 
                    open={openA} 
                    setOpen={setOpenA} />
            </React.Fragment>
          )
        }
        </React.Fragment>
    )
}
