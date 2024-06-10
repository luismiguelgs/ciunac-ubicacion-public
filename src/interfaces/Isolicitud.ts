export default interface Isolicitud {
    id?: string,
    periodo: string,
    voucher: string,
    numero_voucher: string,
    tipo_solicitud: string,
    fecha_pago: any,
    pago: number,
    idioma: string,
    nivel: string,
    cert_trabajo?: string,
    creado?: any,
    modificado?: any,
    id_prospecto?: string
}