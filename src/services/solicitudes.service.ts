import { firestore } from './firebase.service';
import { collection, query, where, getDocs ,serverTimestamp, addDoc, orderBy} from 'firebase/firestore'
import IsolUbicacion from '../interfaces/IsolUbicacion';

export default class SolicitudesService
{
    private static db = collection(firestore, 'solicitudes')
    private static db_prospectos = collection(firestore, 'prospectos')

    public static async getItem(dni:string)
    {
        const q = query(
            this.db,
            where('dni','==',dni) , 
            orderBy('creado','desc')
        )
        // Obtenemos los documentos que cumplen la consulta
        const  querySnapshot = await getDocs(q)

        // Devolvemos un array con los datos de los documentos, incluyendo el ID
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Agregamos el campo 'id' al objeto data
            data.id = doc.id;
            return data;
        });
    }
    public static async fetchRecord(idioma:string,nivel:string,dni:string,solicitud:string){
        const q = query(
            this.db,
            where('dni','==',dni),
            where("idioma","==",idioma),
            where("nivel","==",nivel),
            where('solicitud','==',solicitud),
            where('estado','!=','ENTREGADO')
        )
        // Obtenemos los documentos que cumplen la consulta
        const querySnapshot = await getDocs(q)
    
        // Devolvemos un array con los datos de los documentos, incluyendo el ID
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Agregamos el campo 'id' al objeto data
          data.id = doc.id;
          return data;
        });
    }
    public static async newItem(data:IsolUbicacion){
        const dataProspecto = {
            dni: data.dni,
            nombres: data.nombres,
            apellidos: data.apellidos,
            telefono: data.telefono,
            facultad : data.facultad,
            email: data.email,
            codigo: data.codigo || '',
            trabajador : data.trabajador,
            alumno_ciunac : data.alumno_ciunac,
            creado: serverTimestamp(),
            modificado : serverTimestamp()
        }
        
        let docRef = null
        try{
          docRef = await addDoc(this.db_prospectos, dataProspecto)
        }catch(err){
          console.log(err);
        }
        let newID = null
        if(docRef) newID = docRef.id;
        if(docRef){
            const dataSolicitud = {
                solicitud: data.tipo_solicitud,
                periodo : data.periodo,
                estado:'NUEVO',
                pago:+data.pago,
                idioma:data.idioma,
                nivel:data.nivel,
                img_dni: data.img_dni,
                img_cert_trabajo: data.img_cert_trabajo,
                img_cert_estudio: data.img_cert_estudio,
                img_voucher: data.img_voucher,
                numero_voucher:data.numero_voucher,
                fecha_pago: data.fecha_pago,
                manual:false,
		            trabajador: data.trabajador,
                alumno_id: newID,
                creado:serverTimestamp(),
                modificado:serverTimestamp()
            }
            
            try{
              let docRef1 = await addDoc(this.db, dataSolicitud)
              console.log(docRef1);              
            }catch(err){
              console.log(err);
            }            
        } 
    }
}
