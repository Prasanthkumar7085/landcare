import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const AutoCopleteSearch = ({
    data,
    setSelectType,
    selectType,
    placeholder
}: any) => {

    const handleChange = (event: any, value: any) => {
        setSelectType(value);
    };

    return (
        <Autocomplete
            options={data}
            getOptionLabel={(option) => option.label} // Adjust this based on your data structure
            value={selectType}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label={placeholder} variant="outlined" />}
        />
    );
}

export default AutoCopleteSearch;
