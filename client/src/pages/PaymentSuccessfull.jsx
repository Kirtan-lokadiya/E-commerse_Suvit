import { colors } from "@mui/material";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../axiosInstance";
import { NavLink } from "react-router-dom";

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="175"
      height="175"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PaymentSuccessfull() {
  //   console.log("PaymentSuccessfull");
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [transaction, setTransaction] = useState({});
  useEffect(() => {
    async function fetchSuccessDetails() {
      try {
        // Fetch order by ID
        const res = await axiosInstance.get(`/success/${id}`);
        setTransaction(res.data.transaction);
        setOrder(() => res.data.products);
      } catch (error) {
        console.error("Error fetching order by ID:", error);
      }
    }
    fetchSuccessDetails();
  }, [id]);
  //   console.log(order);
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
      <MDBCard>
        <MDBCardBody>
          <CircleCheckIcon
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              color: "green",
              margin: "auto",
            }}
          />
          <MDBCardTitle>Payment Successfull</MDBCardTitle>
          <MDBCardText>
            Thank you for your payment. Your order is being processed.
          </MDBCardText>
          <hr />
          <MDBRow>
            <MDBCol>Total Amount :</MDBCol>
            <MDBCol style={{ display: "flex", justifyContent: "right" }}>
              {transaction.amount}
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>Ordered At:</MDBCol>
            <MDBCol style={{ display: "flex", justifyContent: "right" }}>
              {new Date(transaction.createdAt).toLocaleString()}
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <h4 style={{ display: "flex", justifyContent: "center" }}>
              Ordered Items
            </h4>
          </MDBRow>
          <MDBRow>
            <MDBCol style={{ display: "flex", justifyContent: "center" }}>
              Name
            </MDBCol>
            <MDBCol style={{ display: "flex", justifyContent: "center" }}>
              Quantity
            </MDBCol>
            <MDBCol style={{ display: "flex", justifyContent: "center" }}>
              Price
            </MDBCol>
          </MDBRow>
          {order.products &&
            order.products.map((ele) => (
              <MDBRow key={ele._id}>
                <MDBCol style={{ display: "flex", justifyContent: "center" }}>
                  {ele.product.name}
                </MDBCol>
                <MDBCol style={{ display: "flex", justifyContent: "center" }}>
                  {ele.quantity}
                </MDBCol>
                <MDBCol style={{ display: "flex", justifyContent: "center" }}>
                  {ele.price}
                </MDBCol>
              </MDBRow>
            ))}
          <MDBBtn>
            <NavLink
              style={{
                color: "white",
                display: "flex",
                justifyContent: "right",
              }}
              to="/orders"
            >
              See Orders
            </NavLink>
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default PaymentSuccessfull;
