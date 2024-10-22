import { 
    Box,
    Button,
    Typography,
    useMediaQuery,
    TextField,
 } from "@mui/material"
import Dropzone from "react-dropzone"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../state"
import FlexBetween from "../../components/FlexBetween"
import UserImage from "../../components/UserImage"
import { useState } from "react"
import { Formik } from "formik"
import * as yup from "yup"
import axios from 'axios'

const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    phone: yup.string().required("Phone is required")
})

const MyAccount = () => {
    const user = useSelector((state) => state.user)
    const token = useSelector((state) => state.token)
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const isNonMobile = useMediaQuery("(min-width: 1000px)")

    const initialFormValues = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone
    }

    const handleFormSubmit = async (values, onSubmitProps) => {

        console.log("Form Submitted:", values);
        const formData = new FormData()
        for (let key in values) {
            if (key === "profilePic" && values.profilePic) {
                formData.append("image", values.profilePic)
            } else {
                formData.append(key, values[key])
            }
        }

        try {
            const { data: update } = await axios.put(
                "http://localhost:3001/users/info",
                formData,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )

            if(update) {
                dispatch(setUser({user: update.user}))
            }

            onSubmitProps.resetForm( {values: {
                firstName: update.user.firstName,
                lastName: update.user.lastName,
                username: update.user.username,
                email: update.user.email,
                phone: update.user.phone
            }})
            setErrorMessage("")
            setSuccessMessage("User info updated successfully")

        }
        catch(error) {
            console.error("Error during info update:", error)
            setSuccessMessage("")
            setErrorMessage(error.response.data.message)
        }
    }

    return (
        <Box
            display="grid"
            gridTemplateRows="2"
            gap="15px"
        >
            <Typography
                color="black"
                fontWeight="bold"
                fontSize="1.3rem"
            >
                Account Details
            </Typography>
            <Box>
                <FlexBetween gap="10px">
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialFormValues}
                        validationSchema={validationSchema}
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
                                        gridTemplateColumns="repeat(4, 1fr)"
                                        maxWidth="580px"
                                        sx = {{
                                            "& > div": {gridColumn: isNonMobile ? undefined : "span 4"}
                                        }}
                                    >
                                        <Box sx={{ gridColumn: "span 1"}}>
                                            <UserImage 
                                                image={user.profilePic} 
                                                size="120px" 
                                            />
                                        </Box>
                                        <Box
                                            gridColumn="span 3"
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
                                                                <p style={{textAlign: "center"}}>
                                                                    Add new profile picture here
                                                                </p>
                                                            ) : (
                                                                <FlexBetween>
                                                                    <Typography>
                                                                        {values.profilePic.name}
                                                                    </Typography>
                                                                </FlexBetween>
                                                            )}
                                                        </Box>
                                                    )
                                                }
                                            </Dropzone>
                                        </Box>
                                        <TextField 
                                            label="First Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.firstName}
                                            name="firstName"
                                            error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                            sx={{ gridColumn: "span 2"}}
                                        />
                                        <TextField 
                                            label="Last Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.lastName}
                                            name="lastName"
                                            error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                            sx={{gridColumn: "span 2"}}
                                        />
                                        <TextField 
                                            label="Username"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.username}
                                            name="username"
                                            error={Boolean(touched.username) && Boolean(errors.username)}
                                            helperText={touched.username && errors.username}
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
                                            label="Email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.email}
                                            name="email"
                                            error={Boolean(touched.email) && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                            sx={{ gridColumn: "span 4" }}
                                        />
                                        

                                        {/* error message */}
                                        {errorMessage && (
                                            <Typography
                                                color="red"
                                                fontWeight="bold"
                                                sx={{ gridColumn: "span 4" }}
                                                maxWidth="100%"
                                            >
                                                {errorMessage}
                                            </Typography>
                                        )}

                                        {successMessage && (
                                            <Typography
                                                color="green"
                                                fontWeight="bold"
                                                sx={{ gridColumn: "span 4" }}
                                            >
                                                {successMessage}
                                            </Typography>
                                        )}

                                        {/* buttons */}
                                        <Box sx={{ gridColumn: "span 4" }}>   
                                            <Button
                                                fullWidth
                                                type="submit"
                                                sx={{
                                                    m: "0",
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
                                                Save Changes
                                            </Button>
                                        </Box>
                                    
                                    </Box>
                                </form>
                            ) 
                        } 

                    </Formik>
                </FlexBetween>
            </Box>
        </Box>
    )
}

export default MyAccount
