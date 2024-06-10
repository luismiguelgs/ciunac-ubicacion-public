export interface IbasicVal{
    dni: string,
    email: string,
    alumno_ciunac: boolean,
    trabajador: boolean
}
export interface IstudentVal{
    apellidos:string,
    nombres:string,
    telefono:string,
    idioma: string,
    nivel: string,
    alumno?: boolean,
    facultad?: string,
    codigo?:string,
    imagen?:string
}
export interface IfinVal{
    imagen?:string,
    numero_voucher:string,
    pago:number
    fecha_pago:any
}
export interface IdocumentVal{
    cert_trabajador:boolean,
    cert_ciunac: boolean
}
export interface StudentRef {
    miFuncion: () => void;
}