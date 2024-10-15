import { 
    Box,
    Typography,
    Button,
    Tabs, 
    Tab,
    TextField,
    useMediaQuery,
    styled
} from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import axios from 'axios'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLogout } from "../../state"
import { useNavigate } from "react-router-dom"

const changePasswordSchema = yup.object().shape({
    oldPassword: yup.string().required("This field is required"),
    newPassword: yup.string().required("This field is required")
})

const deleteAccountSchema = yup.object().shape({
    password: yup.string().required("This field is required")
})
const initialValuesChangePassword = {
    oldPassword: "",
    newPassword: ""
}

const initialValuesDeleteAccount = {
    password: ""
}


const AccountSettings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useSelector((state) => state.token)
    const [selectedTab, setSelectedTab] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")
    const isNonMobile = useMediaQuery("(min-width: 1000px)")

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)
        setErrorMessage("")
    }

    const changePassword = async (values, onSubmitProps) => {
        try {
            const response = await axios.put(
                "http://localhost:3001/users/password",
                {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                },
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            console.log(response)
            onSubmitProps.resetForm()
            navigate('/login')
            dispatch(setLogout())
        }
        catch (error) {
            console.error("Error while trying to change password: ", error)
            setErrorMessage(error.response.data.error)
        }
    }

    const deleteAccount = async (values, onSubmitProps) => {
        try {
            const response = await axios.delete(
                `http://localhost:3001/users?password=${values.password}`,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            console.log(response)
            onSubmitProps.resetForm()
            navigate('/login')
            dispatch(setLogout())
        }
        catch (error) {
            console.error("Error while trying to delete account: ", error)
            setErrorMessage(error.response.data.error)
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (selectedTab === 0) {
            await changePassword(values, onSubmitProps)
        }
        else if (selectedTab === 1) {
            deleteAccount(values, onSubmitProps)
        }
    }
    
    return (
    <Box>
        <Typography
            color="black"
            fontWeight="bold"
            fontSize="1.3rem"
            marginBottom="20px"
        >
            Account Settings
        </Typography>
        <Box>
            <Tabs 
                value={selectedTab} 
                onChange={handleTabChange} 
                aria-label="Account Tabs"
                sx={{ marginBottom: "2rem"}}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: "black"
                    }
                }}
            >
                <Tab
                    label="Change Password"
                    sx={{
                        color: "black",
                        '&:focus': {
                            color: "black"
                        }
                    }}
                />
                <Tab
                    label="Delete Account"
                    sx={{
                        color: "black",
                        '&:focus': {
                            color: "black"
                        }
                    }}
                />
            </Tabs>
        </Box>
        <Box>
            <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={selectedTab === 0 ? initialValuesChangePassword : initialValuesDeleteAccount}
                    validationSchema={selectedTab === 0 ? changePasswordSchema : deleteAccountSchema}
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
                                { selectedTab === 0 ? (<>
                                    <Box
                                        display="grid"
                                        gap="20px"
                                        gridTemplateRows="3"
                                        maxWidth="580px"
                                        sx = {{
                                            "& > div": {gridColumn: isNonMobile ? undefined : "span 4"}
                                        }}
                                    >
                                        <TextField 
                                            label="Old Password"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.oldPassword}
                                            name="oldPassword"
                                            error={Boolean(touched.oldPassword) && Boolean(errors.oldPassword)}
                                            helperText={touched.oldPassword && errors.oldPassword}
                                            sx={{ gridColumn: "span 4" }}
                                        />
                                        <TextField 
                                            label="New Password"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.newPassword}
                                            name="newPassword"
                                            error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                                            helperText={touched.newPassword && errors.newPassword}
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
                                                CHANGE PASSWORD
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                                ) : (
                                <>
                                    <Box
                                        display="grid"
                                        gap="20px"
                                        gridTemplateRows="2"
                                        maxWidth="580px"
                                        sx = {{
                                            "& > div": {gridColumn: isNonMobile ? undefined : "span 4"}
                                        }}
                                    >
                                        <Typography 
                                            sx={{
                                                color: "red",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Careful! This action cannot be undone
                                        </Typography>
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
                                                sx={{ gridColumn: "span 4" }}
                                                maxWidth="100%"
                                            >
                                                {errorMessage}
                                            </Typography>
                                        )}

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
                                                        backgroundColor: "red"
                                                    },
                                                    gridColumn: "span 4"
                                                }}
                                            >
                                                DELETE ACCOUNT
                                            </Button>
                                        </Box>
                                    </Box>                                    
                                </>
                                )
                                }   
                            </form>
                        ) 
                    } 
            </Formik>
        </Box> 
    </Box>
    )
}

export default AccountSettings