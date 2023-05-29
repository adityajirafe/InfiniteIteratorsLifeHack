import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Settings({ primary, setPrimary, secondary, setSecondary, address, setAddress }) {
    const [primaryT, setPrimaryT] = useState("");
    const [secondaryT, setSecondaryT] = useState("");
    const [addressT, setAddressT] = useState("");

    const handleSubmit = () => {
        setPrimary(primaryT);
        setSecondary(secondaryT);
        setAddress(addressT);
    };

    const handleReset = (e) => {
        setPrimary("#0473ea");
        setSecondary("#38d200");
        setAddress("");
        setPrimaryT("#0473ea");
        setSecondaryT("#38d200");
        setAddressT("");
    };

    const primaryChange = (e) => {
        setPrimaryT(e.target.value);
    }

    const secondaryChange = (e) => {
        setSecondaryT(e.target.value);
    }

    const addressChange = (e) => {
        setAddressT(e.target.value);
    }

  return (
    <>
        <Box
                display="flex"
                justifyContent="center"
            >

                <Typography
                    sx={{
                        fontSize: "50px",
                        marginTop: '48px'
                    }}
                    >
                    Settings
                </Typography>
            </Box>
    
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        minWidth="80vw"
    >
        <Box
            display="flex"
            flexDirection="row"
        >
            <TextField id="outlined-basic" label={primary || "Input Primary Colour"} variant="outlined" onChange={primaryChange} />
            <Box
                sx={{
                    border: '2px solid #000000',
                    backgroundColor: primaryT ? `${primaryT}` : '#FFFFFF',
                    width: '4vw',
                    borderRadius: '4px'
                }}
            />
        </Box>

        <Box
            display="flex"
            flexDirection="row"
        >
            <TextField id="outlined-basic" label={secondary || "Input Secondary Colour"} variant="outlined" sx={{margin: "16px 0px 16px 0px"}} onChange={secondaryChange}/>
            <Box
                sx={{
                    border: '2px solid #000000',
                    backgroundColor: secondaryT ? `${secondaryT}` : '#FFFFFF',
                    width: '4vw',
                    mt: '16px',
                    mb: '16px',
                    borderRadius: '4px'
                }}
            />
        </Box>

        <Box
            display="flex"
            flexDirection="row"
        >    
            <TextField id="outlined-basic" label={address || "Input Address"} variant="outlined" onChange={addressChange} />
            <Box
                sx={{
                    border: '2px solid #000000',
                    backgroundColor: '#000000',
                    width: '4vw',
                    height: '6.5vh',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media (max-width: 768px)': {
                    width: '8vw',
                    height: '10vh'
                    },
                    '@media (max-width: 480px)': {
                    width: '12vw',
                    height: '15vh'
                    }
                }}
                >
                <CheckCircleIcon
                    sx={{
                    fontSize: '3vw',
                    stroke: addressT ? '#00FF00' : '#808080',
                    '@media (max-width: 768px)': {
                        fontSize: '8vw'
                    },
                    '@media (max-width: 480px)': {
                        fontSize: '12vw'
                    }
                    }}
                />
            </Box>
        </Box>

        <Button
            variant="filled" 
            onClick={handleSubmit}
            sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                '&:hover': {
                background: (theme) => theme.palette.secondary.main
                },
                margin: '16px'
            }}
            > 
            <Typography
                sx={{
                color: "#FFFFFF"
                }}
            >
                Save Changes
            </Typography>
        </Button>

        <Button
            variant="filled" 
            onClick={handleReset}
            sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                '&:hover': {
                background: (theme) => theme.palette.secondary.main
                },
            }}
            > 
            <Typography
                sx={{
                color: "#FFFFFF"
                }}
            >
                Reset Settings
            </Typography>
        </Button>
    </Box>
    </>
  )
}

export default Settings