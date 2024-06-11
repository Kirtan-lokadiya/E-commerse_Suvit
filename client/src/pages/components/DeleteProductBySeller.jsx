import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import TextExpander from "./TextExpander";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";

function DeleteProductBySeller({ products, setProducts }) {
  const authState = useSelector((state) => state.auth);
  const deleteProduct = async (productId, token) => {
    try {
      const response = await axiosInstance.delete(
        `/seller/products/delete-product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response);
      alert("Product Deleted Successfully");
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
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
                  <TextExpander>{product.description}</TextExpander>
                </MDBCardText>
                <MDBBtn
                  color="danger"
                  onClick={() => deleteProduct(product._id, authState.token)}
                >
                  Delete
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </div>
  );
}

export default DeleteProductBySeller;
