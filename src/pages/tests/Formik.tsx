import { Box, Button, TextField } from '@mui/material'
import { Formik, FormikHelpers, FormikProps, useFormikContext } from 'formik'
import React from 'react'
import * as YUP from 'yup';

const ChildComponent : React.FC = () => {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext<any>()

    return(
        <Box p={2}>
            <TextField
                id="name"
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.name && errors.name ? String(errors.name) : ""}
                error={touched.name && Boolean(errors.name)}
                fullWidth
                margin="normal"
            />
            <TextField
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.email && errors.email ? String(errors.email) : ""}
                error={touched.email && Boolean(errors.email)}
                fullWidth
                margin="normal"
            />
        </Box>
    )
}

type FormValues = {
    name: string,
    email: string
}
const initialValues: FormValues = { name: '', email: '' };
const validationSchema = YUP.object<FormValues>({
    name: YUP.string().required('Required'),
    email: YUP.string().email('Invalid email address').required('Required')
})

export default function Test() 
{
    const formikRef = React.useRef<FormikProps<FormValues>>(null)

    const onSubmit = (values:FormValues, actions: FormikHelpers<FormValues>) => {
        console.log(values);
        actions.setSubmitting(false)
    }

    return (
        <div>
            <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {
                formik => (
                    <form onSubmit={formik.handleSubmit}>
                        <ChildComponent />
                        <Button variant='contained' color='primary' onClick={()=>formikRef.current?.submitForm()}>Submit</Button>
                    </form>
                )
            }
            </Formik>
            
        </div>
    )
}
