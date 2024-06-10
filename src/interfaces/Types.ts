export interface Itexto{
    id?:string,
    titulo:string,
    texto:string,
    creado?:string,
    modificado?:string
}
interface Ibase {
    id?:string,
    value:string,
    label:string,
    creado?:string,
    modificado?:string
}
export interface Ifacultad extends Ibase{}
export interface Icurso extends Ibase {}
export interface Icertificado extends Ibase{}

export interface Irow{
    id:number,
    ciclo:String,
    mes:String,
    anno:String,
    profesor?:String
}
export interface IformData{
    ciclo:string,
    mes:string,
    anno:string,
    profesor:string
}