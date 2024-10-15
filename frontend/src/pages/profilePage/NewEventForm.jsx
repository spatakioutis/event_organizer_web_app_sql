import { 
    Box,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useMediaQuery,
    TextField,
    Button,
    Grid
 } from "@mui/material"
import FlexBetween from "../../components/FlexBetween";
import CancelIcon from '@mui/icons-material/Cancel';
import { Formik, Field, FieldArray } from "formik"
import Dropzone from "react-dropzone"
import * as yup from "yup"
import axios from 'axios'
import { useState } from "react"
import { useSelector } from "react-redux"

const newEventSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    duration: yup.number().required("Duration is required").min(0, "Duration must be positive"),
    image: yup.string().required("Image is required"),
    description: yup.string().required("Description is required"),
    ticketPrice: yup.number().required("Ticket price is required").min(0, "Ticket price must be positive"),
    type: yup.string().required('Type is required').notOneOf(['Type'], 'Type is required'),
    specificDateInfo: yup.array().of(
        yup.object().shape({
            date: yup.string().required('Date is required'),
            location: yup.string().required('Location is required'),
            totalSeats: yup.number().required('Number of seats is required').min(0, 'Total seats must be a non-negative number')
        })
    )
})

const initialValuesEvent = {
    title: "",
    duration: 0,
    image: "",
    description: "",
    ticketPrice: 0,
    type: "",
    specificDateInfo: [{
        date: "",
        location: "",
        totalSeats: 0
    }]
}

const NewEventForm = () => {

    const token = useSelector((state) => state.token)
    const [selectedType, setSelectedType] = useState("Type")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const isNonMobile = useMediaQuery("(min-width: 1000px)")

    const createEvent = async (values, onSubmitProps) => {

        const formData = new FormData()
        for (let key in values) {
            if (key === "image" && values.image) {
                formData.append("image", values.image)
            } 
            else if (key === "specificDateInfo") {
                formData.append(key, JSON.stringify(values[key]))
            } 
            else {
                formData.append(key, values[key])
            }
        }        

        try {
            const response = await axios.post(
                "http://localhost:3001/events",
                formData,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            console.log(response)
            onSubmitProps.resetForm()
            setSuccessMessage("Event created successfully")
        }
        catch (error) {
            console.error("Error while trying to create event: ", error)
            setSuccessMessage("")
            setErrorMessage(error.response.data.error)
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        await createEvent(values, onSubmitProps)
        console.log(values)
    }

    return (
        <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValuesEvent}
                validationSchema={newEventSchema}
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
                                    // maxRows={20}
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
                                                            Add image here
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
                                <Typography
                                    color="black"
                                    sx={{gridColumn: "span 3"}}
                                >
                                    Specific Date Information
                                </Typography>
                                <FieldArray 
                                    name="specificDateInfo"
                                    
                                >
                                    {({ insert, remove, push }) => (
                                        <div style={{width: "100%", gridColumn: "span 3"}}>
                                            {values.specificDateInfo.length > 0 &&
                                                values.specificDateInfo.map((_, index) => (
                                                    <Box key={index} sx={{ marginBottom: 2 }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={3.5} sm={3.5}>
                                                                <Field
                                                                    name={`specificDateInfo.${index}.date`}
                                                                    as={TextField}
                                                                    type="datetime-local"
                                                                    label="Date"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    InputLabelProps={{ shrink: true }}
                                                                    error={touched.specificDateInfo?.[index]?.date && Boolean(errors.specificDateInfo?.[index]?.date)}
                                                                    helperText={touched.specificDateInfo?.[index]?.date && errors.specificDateInfo?.[index]?.date}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3.5} sm={3.5}>
                                                                <Field
                                                                    name={`specificDateInfo.${index}.location`}
                                                                    as={TextField}
                                                                    label="Location"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    error={touched.specificDateInfo?.[index]?.location && Boolean(errors.specificDateInfo?.[index]?.location)}
                                                                    helperText={touched.specificDateInfo?.[index]?.location && errors.specificDateInfo?.[index]?.location}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3.5} sm={3.5}>
                                                                <Field
                                                                    name={`specificDateInfo.${index}.totalSeats`}
                                                                    as={TextField}
                                                                    type="number"
                                                                    label="Total Seats"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    error={touched.specificDateInfo?.[index]?.totalSeats && Boolean(errors.specificDateInfo?.[index]?.totalSeats)}
                                                                    helperText={touched.specificDateInfo?.[index]?.totalSeats && errors.specificDateInfo?.[index]?.totalSeats}
                                                                />
                                                            </Grid>
                                                            <Grid   item xs={1}
                                                                    alignSelf="center"
                                                            >
                                                                <CancelIcon 
                                                                    fontSize="large"
                                                                    onClick={() => remove(index)}
                                                                    sx={{color: "red",
                                                                        "&:hover": {
                                                                            cursor: "pointer"
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                ))
                                            }
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => push({ date: '', location: '', totalSeats: '' })}
                                            >
                                                Add another event date
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>

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
                                        CREATE EVENT
                                    </Button>
                                </Box>
                                {successMessage && (
                                    <Typography
                                        color="green"
                                        fontWeight="bold"
                                        sx={{ gridColumn: "span 3" }}
                                    >
                                        {successMessage}
                                    </Typography>
                                )}
                            </Box>
                        </form>
                    )
                }
        </Formik>
    )
}

export default NewEventForm