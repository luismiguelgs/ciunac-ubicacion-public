import React from 'react'
import { useNavigate } from "react-router-dom"
import { useStateContext } from '../../contexts/ContextProvider'
import { Alert, Box, Button, Grid, Link } from '@mui/material'
import IsolUbicacion from '../../interfaces/IsolUbicacion'
import { MyDialog } from '../../components/mui'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DataDisplay from '../../components/final/DataDisplay'
import SwitchResaltado from '../../components/SwitchResaltado'
import Disclamer from '../../components/final/Disclamer'
import SolicitudesService from '../../services/solicitudes.service'

type Props = {
    data:IsolUbicacion
    handleBack : () => void
}
type Condiciones = {
    data:boolean,
    aceptar:boolean
  }
  
export default function Final({data, handleBack }:Props) 
{
    const { textos } = useStateContext()

	const navigate = useNavigate()
    const [condiciones, setCondiciones] = React.useState<Condiciones>({data:false, aceptar:false})

    const [open, setOpen] = React.useState<boolean>(false)

    const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    	setCondiciones({
      	...condiciones,
      	[event.target.name]: event.target.checked,
    	});
  	};
    const handleFinish = () =>{
    	//guardar nuevo registro
    	SolicitudesService.newItem(data)
    	//Ir a la pagina final
		navigate('/final')
    	setOpen(false)
  	}

    return (
        <Box sx={{m:2, display:'flex', flexDirection:'column'}}>
            <Alert sx={{mt:2, mb:2}} severity="info">
				{textos.find(objeto=> objeto.titulo === 'texto_ubicacion_3')?.texto}
                <Link href="https://ciunac.unac.edu.pe/">ciunac.unac.edu.pe</Link>
			</Alert>
            <DataDisplay data={data} />
            <Grid container spacing={1} justifyContent='center'>
				<Grid item xs={6}>
					<SwitchResaltado
					checked={condiciones.data}
					mensaje='Marcar si los datos indicados lineas arriba son los correctos' 
					label="Los datos proporcionados son los correctos"
					name="data" 
					handleChange={handleChangeSwitch}
					fullWidth={true}/>
				</Grid>
				<Grid item xs={6}>
					<SwitchResaltado
						checked={condiciones.aceptar}
						mensaje='Marcar si acepta todos los términos y condiciones líneas abajo' 
						label="Acepta todos los términos y condiciones"
						name="aceptar" 
						handleChange={handleChangeSwitch}
						fullWidth={true}/>
				</Grid>
			</Grid>
            <Disclamer />
            <Box sx={{display:'flex',flexDirection:'column',pt:2, alignContent:'center', alignItems:'center'}}>
				<Box sx={{flex: '1 1 auto'}}>
					<Button color='primary' onClick={handleBack} sx={{mr:1}} variant="outlined" startIcon={<ArrowBackIcon />}>
					    REGRESAR
					</Button>
					<Button 
						disabled={!(condiciones.data && condiciones.aceptar)} color='primary' 
						onClick={()=>setOpen(true)} 
						sx={{mr:1}} 
						variant="outlined"
						endIcon={<AssignmentTurnedInIcon />}>
							FINALIZAR
					</Button>
				</Box>	
			</Box>
            <MyDialog 
				type="ALERT"
				title={data.tipo_solicitud}
				content={`Enviar datos correspondientes a su solicitud: ${data.tipo_solicitud}`}
				open={open}
				setOpen={setOpen}
				actionFunc={handleFinish}
			/>
        </Box>
    )
}
