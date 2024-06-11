import * as React from "react";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import SvgIcon from "@mui/joy/SvgIcon";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";

const fetchSellersData = async (token) => {
  try {
    const response = await axiosInstance.get("/categories/sellers", {
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token here
      },
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching sellers data:", error);
    throw error;
  }
};

export default function Seller() {
  const [sellers, setSellers] = React.useState([]);
  const token = useSelector((state) => state.auth.token); // Assuming you use Redux for state management

  React.useEffect(() => {
    const getSellers = async () => {
      try {
        const data = await fetchSellersData(token);
        setSellers(data.sellers);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    getSellers();
  }, [token]);

  const handleDeleteSeller = async (sellerId) => {
    try {
      await axiosInstance.put(
        `/auth/sellers/delete/${sellerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Seller deleted successfully");
      setSellers(sellers.filter((seller) => seller._id !== sellerId));
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };
  return (
    <MDBRow>
      {sellers.map((seller) => (
        <MDBCol md="3" key={seller._id}>
          <div style={{ marginTop: "1rem" }}>
            <Card
              key={seller.id}
              variant="outlined"
              color="danger"
              invertedColors
              className="admin-seller-card"
            >
              <CardContent orientation="horizontal">
                <CardContent>
                  <Typography level="body-md">
                    {seller.firstName} {seller.lastName}
                  </Typography>
                  <Typography level="body-md">Email: {seller.email}</Typography>
                </CardContent>
              </CardContent>
              <CardActions>
                <Button
                  variant="soft"
                  size="sm"
                  color="danger"
                  onClick={() => handleDeleteSeller(seller._id)}
                >
                  Delete Seller
                </Button>
              </CardActions>
            </Card>
          </div>
        </MDBCol>
      ))}
    </MDBRow>
  );
}
