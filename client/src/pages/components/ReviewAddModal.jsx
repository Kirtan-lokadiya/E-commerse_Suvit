import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const btnstyle = {
  color: "white",
  display: "flex",
  margin: "auto",
};

const addReview = async (productId, text, rating, token, handleClose) => {
  // Retrieve the token from the Redux store
  try {
    const response = await axiosInstance.post(
      "/comments/add",
      {
        productId,
        text,
        rating,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Review added successfully:", response.data);
    // return response.data;
    
    handleClose();
    return;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export default function ReviewAddModal({ product }) {
  const authState = useSelector((state) => state.auth);
  const [value, setValue] = React.useState(2);
  const [review, setReview] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button style={btnstyle} onClick={handleOpen}>
        Add Review
      </Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <MDBInput
              type="textarea"
              label="Review"
              rows="4"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </Typography>
          <MDBBtn
            onClick={() =>
              addReview(
                product._id,
                review,
                value,
                authState.token,
                handleClose
              )
            }
            style={{ marginTop: "10px" }}
          >
            Submit
          </MDBBtn>
        </Box>
      </Modal>
    </div>
  );
}
