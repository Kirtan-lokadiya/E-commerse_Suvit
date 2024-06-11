import { useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import {
  MDBCard,
  MDBCardTitle,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";

function ManageOrders() {
  const authState = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/seller/products/order", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setOrders(() => response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [authState.token]);
  console.log(orders);
  return (
    <>
      <NavBar />
      <h2 style={{ display: "flex", justifyContent: "center" }}>Orders</h2>

      <MDBRow>
        {orders.length !== 0 &&
          orders.map((order) => (
            <MDBCol md="4">
              <MDBCard
                key={order._id}
                style={{ padding: "2rem", margin: "2rem" }}
              >
                <MDBCardTitle>Order ID: {order.orderId}</MDBCardTitle>
                <MDBRow>
                  <MDBCol>Total Amount :</MDBCol>
                  <MDBCol style={{ display: "flex", justifyContent: "right" }}>
                    {order.totalAmount}
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>Ordered At:</MDBCol>
                  <MDBCol style={{ display: "flex", justifyContent: "right" }}>
                    {new Date(order.orderedAt).toLocaleString()}
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>Order Status:</MDBCol>
                  <MDBCol style={{ display: "flex", justifyContent: "right" }}>
                    {order.status}
                  </MDBCol>
                </MDBRow>

                {/* <p>Payment Method: {order.paymentMethod}</p>
                <p>Shipping Address: {order.shippingAddress}</p> */}
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
                      <MDBCol
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {ele.name}
                      </MDBCol>
                      <MDBCol
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {ele.quantity}
                      </MDBCol>
                      <MDBCol
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {ele.price}
                      </MDBCol>
                    </MDBRow>
                  ))}
              </MDBCard>
            </MDBCol>
          ))}
      </MDBRow>
    </>
  );
}

export default ManageOrders;
