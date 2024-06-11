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
import { MDBCardTitle, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { CardTitle } from "react-bootstrap";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";
import TextExpander from "./TextExpander";

const fetchproductsData = async (token) => {
  try {
    const response = await axiosInstance.get("/customer/products/allProducts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products data:", error);
    throw error;
  }
};

export default function AdminProductList() {
  const [products, setproducts] = React.useState([]);
  const token = useSelector((state) => state.auth.token);

  const deleteProduct = async (productId, token) => {
    try {
      await axiosInstance.put(
        `/users-update/products/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product deleted successfully");
      setproducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  React.useEffect(() => {
    const getproducts = async () => {
      try {
        const data = await fetchproductsData(token);
        setproducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getproducts();
  }, [token]);
  console.log(products);
  return (
    <MDBRow>
      {products.map((product) => (
        <MDBCol key={product._id} md="4">
          <MDBCard className="same-size-card">
            <MDBCardImage
              className="same-size-card-image"
              src={
                `${process.env.REACT_APP_IMAGE_PREFIX}${product.imageUrls[0]}` ||
                "https://mdbootstrap.com/img/new/standard/nature/184.webp"
              }
              position="top"
              alt={product.name}
            />
            <MDBCardBody>
              <MDBCardTitle>{product.name}</MDBCardTitle>
              <MDBCardText>
                Seller Name: {product.seller.firstName}{" "}
                {product.seller.lastName}
              </MDBCardText>
              <MDBCardText>Seller Email : {product.seller.email}</MDBCardText>
              <MDBCardText>
                <TextExpander>{product.description}</TextExpander>
              </MDBCardText>
              <MDBBtn
                color="danger"
                onClick={() => deleteProduct(product._id, token)}
              >
                Delete
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}
    </MDBRow>
  );
}
