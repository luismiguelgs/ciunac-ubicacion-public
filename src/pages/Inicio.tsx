import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import Formulario from '../components/inicio/Formulario'
import { MySnackBar } from '../components/mui'

export default function Inicio() 
{
    const {setAuth} = useStateContext()
    const navigate = useNavigate()
    const captchaRef = React.useRef<ReCAPTCHA>(null)
    

    //estado de snackbar informativo
    const [open, setOpen] = React.useState<boolean>(false);
    
    //iniciar proceso
    const handleClick = () => {
        if(!captchaRef.current?.getValue()){
            setOpen(true)
        }
        else{
            //console.log(data);
            setAuth(true) 
            setOpen(false)
            navigate("/proceso")
        }
    }
    
    return (
       <>
            <Formulario handleClick={handleClick} captchaRef={captchaRef} />
            <MySnackBar 
                open= {open}
                content="Ingresar los datos solicitados RE-CAPTCHA"
                setOpen={setOpen}
                severity="error" />
       </>
    )
}
