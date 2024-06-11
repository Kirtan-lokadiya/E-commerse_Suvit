import React, { useState } from "react";
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
import UpdateProduct from "./UpdateProduct";

function UpdateInfoProduct({ products, setProducts }) {
  const [updateInProcess, setUpdateInProcess] = useState(0);
  return (
    <div>
      {updateInProcess === 0 ? (
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
                    color="success"
                    onClick={() => setUpdateInProcess(product._id)}
                  >
                    Update Product Info
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      ) : (
        <UpdateProduct id={updateInProcess} />
      )}
    </div>
  );
}

export default UpdateInfoProduct;
