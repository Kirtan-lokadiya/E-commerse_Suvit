import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({
  subcategories,
  name,
  value,
  handleChange,
}) {
  // console.log(subcategories);
  // console.log(value);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{name}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value.name} // Use the id for the value
          label="Sub Categories"
          onChange={(e) => handleChange(e, subcategories.find(sub => sub.name === e.target.value))} // Pass the event and the selected subcategory
        >
          {subcategories.map((subcategory) => (
            <MenuItem key={subcategory._id} value={subcategory?.name}>
              {subcategory.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
