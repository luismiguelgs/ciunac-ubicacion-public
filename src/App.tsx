import { Box } from '@mui/material'
import './App.css'
import { useStateContext } from './contexts/ContextProvider'
import { MyAppBar } from './components/mui'
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PrivateRoutes from './pages/PrivateRoutes';
import Proceso from './pages/Proceso';
import Finish from './pages/Finish';
import ConsultDetail from './pages/ConsultDetail';
import Consult from './pages/Consult';
import Inicio from './pages/Inicio';
import Preloader from './components/inicio/Preloader';
import Test from './pages/tests/Test';

function App()
{
    const {auth, loading} = useStateContext()

    return (
        <>
            <CssBaseline />
            <Box sx={{flexGrow:1}}>
                <MyAppBar title='SOLICITUD - EXAMEN DE UBICACIÓN' />
            </Box>
            {/*   Router   */ }
            {
                loading ? (
                    <Preloader />
                ) : (
                    <BrowserRouter>
                    <Routes>
                        <Route path='/test/*' element={<Test /> } /> 
                        <Route path='/' element={<Inicio /> } /> 
                        <Route element={<PrivateRoutes auth={auth}/>}>
                            <Route path='/proceso/*' element={<Proceso />} />
                            <Route path='/final' element={<Finish />} />
                            <Route path='/consulta-detalle' element={<ConsultDetail />} />
                        </Route>
                        <Route path='/consulta' element={<Consult />} />
                        <Route path="*" element={<div><p>Página no disponible: 404!</p><Link to={'/'} >Inicio</Link></div>} />
                    </Routes>
                </BrowserRouter>
                )
            }
        </>
    )
}

export default App
