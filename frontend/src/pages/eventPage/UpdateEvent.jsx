import { 
    Box,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useMediaQuery,
    TextField,
    Button
 } from "@mui/material"
import FlexBetween from "../../components/FlexBetween";
import Navbar from "../navbar";
import { Formik } from "formik"
import Dropzone from "react-dropzone"
import * as yup from "yup"
import axios from 'axios'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    duration: yup.number().required("Duration is required").min(0, "Duration must be positive"),
    description: yup.string().required("Description is required"),
    ticketPrice: yup.number().required("Ticket price is required").min(0, "Ticket price must be positive"),
    type: yup.string().required('Type is required').notOneOf(['Type'], 'Type is required'),
})

const UpdateEvent = () => {

    const navigate = useNavigate()
    const { eventId } = useParams()
    const token = useSelector((state) => state.token)
    const [eventDetails, setEventDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedType, setSelectedType] = useState("Type")
    const [errorMessage, setErrorMessage] = useState("")
    const isNonMobile = useMediaQuery("(min-width: 1000px)")

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const {data: response} = await axios.get(
                    `http://localhost:3001/events/${eventId}`,
                    {
                        headers: { "Authorization": `Bearer ${token}`}
                    }
                )
                setEventDetails({
                    title: response.event.title,
                    duration: response.event.duration,
                    description: response.event.description,
                    ticketPrice: response.event.ticketPrice,
                    type: response.event.type
                })
                setSelectedType(response.event.type)
                setLoading(false)
            }
            catch (error) {
                console.error('Error while fetching event data: ', error)
                setLoading(false)
            }
        } 
        fetchEventDetails()
    }, [])

    const updateEvent = async (values, onSubmitProps) => {
        console.log("hello")
        const formData = new FormData()
        const updates = {
            title: values.title,
            duration: values.duration,
            description: values.description,
            ticketPrice: values.ticketPrice,
            type: values.type,
        }

        formData.append('updates', JSON.stringify(updates))
    
        if (values.image) {
            formData.append('image', values.image)
        }      

        try {
            const {data: response} = await axios.put(
                `http://localhost:3001/events/${eventId}`,
                formData,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            navigate(`/events/${eventId}`)
        }
        catch (error) {
            console.error("Error while trying to update event: ", error)
            setErrorMessage(error.response.data.error)
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        await updateEvent(values, onSubmitProps)
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="black">Loading...</Typography>
            </Box>
        )
    }

    return (<>
        <Navbar />
        <Box
            margin="100px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="15px"
        >
            <Typography color="black" fontWeight="bold" fontSize="26pt" sx={{textIndent: "-180px"}}>
                Update Event Information
            </Typography>
            <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={eventDetails}
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
                                    gap="20px"
                                    gridTemplateColumns="repeat(3, 1fr)"
                                    maxWidth="580px"
                                    sx = {{
                                        "& > div": {gridColumn: isNonMobile ? undefined : "span 4"}
                                    }}
                                >
                                    <Typography
                                        color="black"
                                        sx={{ gridColumn: "span 3" }}
                                    >
                                        General Event Information
                                    </Typography>
                                    <TextField 
                                        label="Title"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.title}
                                        name="title"
                                        error={Boolean(touched.title) && Boolean(errors.title)}
                                        helperText={touched.title && errors.title}
                                        sx={{ gridColumn: "span 3" }}
                                    />
                                    <FormControl 
                                        sx={{ gridColumn: "span 1" }}
                                        variant="standard" 
                                        value={selectedType}
                                        color="black"
                                    >
                                        <Select
                                            displayEmpty
                                            value={selectedType}
                                            onChange={(e) => {
                                                setFieldValue('type', e.target.value)
                                                setSelectedType(e.target.value)
                                            }}
                                            style={{
                                                minWidth: '150px',
                                                width: 'auto',
                                                height: '100%'
                                            }}
                                            sx={{
                                                border: "1px solid #ccc",
                                                backgroundColor: "#f0f0f0",
                                                width: "150px",
                                                borderRadius: "0.25rem",
                                                p: "0.25rem 1rem",
                                                "& .MuiSvgIcon-root": {
                                                    pr: "0.25rem",
                                                    width: "3rem"
                                                },
                                                "& .MuiSelect-select:focus": {
                                                    backgroundColor: "#f0f0f0"
                                                }
                                            }}
                                            input={<InputBase />}
                                        >
                                            <MenuItem value="Type" disabled>Type</MenuItem>
                                            <MenuItem value="Movies">Movies</MenuItem>
                                            <MenuItem value="Theater">Theater</MenuItem>
                                            <MenuItem value="Music">Music</MenuItem>
                                            <MenuItem value="Sports">Sports</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField 
                                        label="Duration"
                                        type="number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.duration}
                                        name="duration"
                                        error={Boolean(touched.duration) && Boolean(errors.duration)}
                                        helperText={touched.duration && errors.duration}
                                        sx={{ gridColumn: "span 1"}}
                                    />
                                    <TextField 
                                        label="Ticket Price"
                                        type="number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.ticketPrice}
                                        name="ticketPrice"
                                        error={Boolean(touched.ticketPrice) && Boolean(errors.ticketPrice)}
                                        helperText={touched.ticketPrice && errors.ticketPrice}
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <TextField 
                                        label="Description"
                                        multiline
                                        rows={6}
                                        fullWidth
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.description}
                                        name="description"
                                        error={Boolean(touched.description) && Boolean(errors.description)}
                                        helperText={touched.description && errors.description}
                                        sx={{ gridColumn: "span 3"}}
                                    />
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
                                                setFieldValue("image", acceptedFiles[0])
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
                                                        {!values.image ? (
                                                            <p style={{textAlign: "center"}}>
                                                                Add new image here
                                                            </p>
                                                        ) : (
                                                            <FlexBetween>
                                                                <Typography>
                                                                    {values.image.name}
                                                                </Typography>
                                                            </FlexBetween>
                                                        )}
                                                    </Box>
                                                )
                                            }
                                        </Dropzone>
                                    </Box>
                                    {errorMessage && (
                                        <Typography
                                            color="red"
                                            fontWeight="bold"
                                            sx={{ gridColumn: "span 3" }}
                                            maxWidth="100%"
                                        >
                                            {errorMessage}
                                        </Typography>
                                    )}

                                    <Box sx={{ gridColumn: "span 3" }}>   
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
                                                gridColumn: "span 3"
                                            }}
                                        >
                                            UPDATE EVENT
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        )
                    }
            </Formik>
        </Box>
    </>)
}

export default UpdateEvent