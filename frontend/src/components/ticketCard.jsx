import { 
    Box,
    Button,
    Typography,
    useMediaQuery,
    TextField,
} from "@mui/material"
import FlexBetween from "./FlexBetween"
import { Formik } from "formik"
import axios from "axios"
import { useState } from "react"
import * as yup from "yup"
import { useSelector } from "react-redux"

const validationSchema = yup.object().shape({
    numOfTickets: yup.number().required("Number of tickets is required").min(1, "Must be positive")
})

const TicketCard = (props) => {
    const isNonMobile = useMediaQuery("(min-width: 1000px)")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const token = useSelector((state) => state.token)
    const disabledButton = (props.seatsAvailable === 0) || (new Date(props.date) < new Date())

    const takeFormattedDate = (dateString) => {
        const date = new Date(dateString)
    
        // Format date
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const formattedDate = `${day}/${month}/${year}`
    
        // Format time
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const formattedTime = `${hours}:${minutes}`
    
        // Combine date and time with a new line
        return `${formattedDate}\n${formattedTime}`
    }

    const createBooking = async (values, onSubmitProps) => {
        try {
            const {data: response} = await axios.post(
                "http://localhost:3001/bookings",
                {
                    eventID: props.eventID,
                    date: props.date,
                    numOfTickets: values.numOfTickets
                },
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )

            setErrorMessage("")
            setSuccessMessage("Tickets booked successfully!")
            onSubmitProps.resetForm()
        }
        catch(error) {
            console.error("Error during tickets' booking:", error)
            setSuccessMessage("")
            setErrorMessage(error.response.data.message)
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        await createBooking(values, onSubmitProps)
    }

    return (
        <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Box
                padding="15px"
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
                gap="80px"
                height="50px"
                width="1000px"
            >
                <Typography color="black" width="100px">
                    {takeFormattedDate(props.date)}
                </Typography>
                <Typography 
                    color="black"
                    sx={{
                        width: "200px",
                        wordWrap: "break-word",
                        overflow: "wrap",
                        overflowWrap: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                    }} 
                >
                    {props.location}
                </Typography>
                <Typography color="black" width="50px">
                    {props.price}€
                </Typography>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={{ numOfTickets: 1 }}
                    validationSchema={validationSchema}
                >
                    {({
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
                                padding="10px"
                                display="grid"
                                gap="20px"
                                gridTemplateColumns="3fr 5fr"
                                maxWidth="400px"
                                margin="0 auto"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                                }}
                            >
                                <TextField
                                    label="Number of Tickets"
                                    type="number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.numOfTickets}
                                    name="numOfTickets"
                                    error={Boolean(touched.numOfTickets) && Boolean(errors.numOfTickets)}
                                    helperText={touched.numOfTickets && errors.numOfTickets}
                                    sx={{ gridColumn: "span 1" }}
                                />
                                <Box sx={{ gridColumn: "span 1", marginLeft: "40px" }}>
                                    {disabledButton ? (
                                        <Button
                                            fullWidth
                                            disabled
                                            sx={{
                                                m: "0",
                                                p: "1rem",
                                                backgroundColor: "#8f408f",
                                                color: "white",
                                                gridColumn: "span 4"
                                            }}
                                        >
                                            Book Tickets
                                        </Button>
                                    ) : (
                                        <Button
                                            fullWidth
                                            type="submit"
                                            sx={{
                                                m: "0",
                                                p: "1rem",
                                                backgroundColor: "#800080",
                                                color: "white",
                                                "&:hover": {
                                                    color: "white",
                                                    border: "1px solid #ccc",
                                                    backgroundColor: "green"
                                                },
                                                gridColumn: "span 4"
                                            }}
                                        >
                                            Book Tickets
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
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
        </Box>
    )
}

export default TicketCard