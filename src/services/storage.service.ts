import React from 'react';
import {storage } from './firebase.service';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default class StorageService
{
    public static async uploadDocument(name: string, data:Blob, setEnviar:React.Dispatch<React.SetStateAction<boolean>>, 
        setProgress:React.Dispatch<React.SetStateAction<number>>, setData:React.Dispatch<React.SetStateAction<any>>,
        ubicacion:string, prop:string)
    {
        const storageRef = ref(storage, `${ubicacion}/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, data);
        uploadTask.on('state_changed', (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress)
          },(error)=>{
            console.log(error.message);
          },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                setEnviar(false)
                console.log('Archivo disponible en... ', downloadUrl);
                setData((prevFormData:any)=>({...prevFormData, [prop]:downloadUrl}))
            });
          });
    }

    public static uploadTrabajador(name:string, data:Blob, setEnviar:React.Dispatch<React.SetStateAction<boolean>>, 
      setProgress:React.Dispatch<React.SetStateAction<number>>, setConstancia:React.Dispatch<React.SetStateAction<string>>)
    {
        const storageRef = ref(storage, `trabajadores/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, data);
        uploadTask.on('state_changed', (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setEnviar(true)
            setProgress(progress)
          },(error)=>{
            console.log(error.message);
          },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                setConstancia(downloadUrl)
                console.log('Archivo disponible en... ', downloadUrl);
            });
          });
    }
}