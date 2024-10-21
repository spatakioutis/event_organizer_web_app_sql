import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography
} from "@mui/material"
import { EditOutlinedIcon } from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from 'react-dropzone';
import FlexBetween from "../../components/FlexBetween";
import axios from 'axios';

// schemas
const registerSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    birthDate: yup.string().required("Birth date is required"),
    profilePic: yup.string(),
    phone: yup.string().required("Phone is required")
})

const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
})

// initial values
const initialValuesRegister = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    birthDate: "",
    profilePic: "",
    phone: ""
}

const initialValuesLogin = {
    username: "",
    password: ""
}

// form component
const Form = () => {
    const [pageType, setPageType] = useState("login")
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isNonMobile = useMediaQuery("(min-width:600px)")
    const isLogin = (pageType === "login")
    const isRegister = (pageType === "register")

    // create user
    const register = async (values, onSubmitProps) => {
        
        // to send info with image
        const formData = new FormData()
        for (let key in values) {
            if (key === "profilePic" && values.profilePic) {
                formData.append("image", values.profilePic)
            } else {
                formData.append(key, values[key])
            }
        }

        try {
            const { data: savedUser } = await axios.post(
                "http://localhost:3001/auth/register",
                formData
            )
            onSubmitProps.resetForm()

            if(savedUser) {
                setPageType("login")
            }
        }
        catch(error) {
            console.error("Error during registration:", error)
            setErrorMessage(error.response.data.message)
        }
    }

    // login user
    const login = async (values, onSubmitProps) => {

        try {
            const { data: loggedIn } = await axios.post(
                "http://localhost:3001/auth/login",
                values,
                {
                    headers: { "Content-Type": "application/json" }
                }
            )
            onSubmitProps.resetForm()

            if (loggedIn) {
                dispatch(
                    setLogin({
                        user: loggedIn.user,
                        token: loggedIn.token
                    })
                )
                navigate("/home")
                console.log(loggedIn.user)
            }
        }
        catch(error) {
            console.error("Error during login:", error)
            setErrorMessage(error.response.data.message)
        }
    }

    // handle register/login
    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) {
            await login(values, onSubmitProps)
        }
        else {
            await register(values, onSubmitProps)
        }
    }


    return (
        
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {
                ({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx = {{
                                "& > div": {gridColumn: isNonMobile ? undefined : "span 4"}
                            }}
                        >

                            {/* only for register */}
                            {isRegister && (
                                <>
                                    <TextField 
                                        label="First Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.firstName}
                                        name="firstName"
                                        error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField 
                                        label="Last Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastName}
                                        name="lastName"
                                        error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField 
                                        label="Phone"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phone}
                                        name="phone"
                                        error={Boolean(touched.phone) && Boolean(errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField 
                                        label="Birth Date"  
                                        type="date"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.birthDate}
                                        name="birthDate"
                                        error={Boolean(touched.birthDate) && Boolean(errors.birthDate)}
                                        helperText={touched.birthDate && errors.birthDate}
                                        sx={{ gridColumn: "span 2",
                                            '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                                cursor: 'pointer'
                                            }
                                         }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                    <TextField 
                                        label="Email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        error={Boolean(touched.email) && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <Box
                                        gridColumn="span 4"
                                        border={"1px solid grey"}
                                        borderRadius="5px"
                                        p="1rem"
                                    >
                                        <Dropzone
                                            acceptedFiles=".jpg,.jpeg,.png"
                                            multiple={false}
                                            onDrop={(acceptedFiles) => {
                                                setFieldValue("profilePic", acceptedFiles[0])
                                            }}
                                        >
                                            {
                                                ({getRootProps, getInputProps}) => (
                                                    <Box
                                                        color="black"
                                                        {...getRootProps()}
                                                        border={"2px dashed #9b59b6"}
                                                        p="1rem"
                                                        sx={{ 
                                                            "&:hover": { 
                                                                cursor: "pointer",
                                                                border: "2px dashed #BFA0C1"
                                                            } 
                                                        }}
                                                    >
                                                        <input {...getInputProps()} />

                                                        {!values.profilePic ? (
                                                            <p>
                                                                Add Picture Here
                                                            </p>
                                                        ) : (
                                                            <FlexBetween>
                                                                <Typography>
                                                                    {values.profilePic.name}
                                                                </Typography>
                                                                {/* <EditOutlinedIcon /> */}
                                                            </FlexBetween>
                                                        )}
                                                    </Box>
                                                )
                                            }
                                        </Dropzone>
                                    </Box>
                                </>
                            )}

                            {/* both for login/register */}
                            <TextField 
                                label="Username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name="username"
                                error={Boolean(touched.username) && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField 
                                label="Password"
                                type="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 4" }}
                            />
                            
                            {/* error message */}
                            {errorMessage && (
                                <Typography
                                    color="red"
                                    fontWeight="bold"
                                >
                                    {errorMessage}
                                </Typography>
                            )}

                            {/* buttons */}
                            <Box sx={{ gridColumn: "span 4" }}>
                                
                                <Button
                                    fullWidth
                                    type="submit"
                                    sx={{
                                        m: "2rem 0",
                                        p: "1rem",
                                        backgroundColor: "#800080",
                                        color: "white",
                                        "&:hover" : { 
                                            color: "white",
                                            border: "1px solid #ccc",
                                            backgroundColor: "#9b59b6"
                                        },
                                        gridColumn: "span 4"
                                    }}
                                >
                                    {isLogin ? "LOGIN" : "REGISTER"}
                                </Button>
                                
                                <Typography
                                    onClick={() => {
                                        setPageType((prevState) => {
                                            const newPageType = (prevState === "login" ? "register" : "login")
                                            if (newPageType === "login") {
                                                resetForm({ values: initialValuesLogin })
                                            } else {
                                                resetForm({ values: initialValuesRegister })
                                            }
                                            return newPageType
                                        })
                                    }}
                                    sx={{
                                        textDecoration: "underline",
                                        color: "black",
                                        "&:hover": {
                                            cursor: "pointer",
                                            color: "#6d6d6d",
                                        }
                                    }}
                                >
                                    {isLogin ? "Don't have an account? Sign up here!" : "Already have an account? Log in here!"}
                                </Typography>

                            </Box>
                        
                        </Box>
                    </form>
                ) 
            } 

        </Formik>
    )
}

export default Form