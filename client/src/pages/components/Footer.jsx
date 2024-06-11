import React, { useEffect, useState } from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const fetchMainCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories/main");
    return response.data;
  } catch (error) {
    console.error("Error fetching main categories:", error);
    throw error;
  }
};

export default function Footer() {
  const [categories, setCategories] = useState([]);
  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchMainCategories();
        setCategories(data);
      } catch (error) {
        alert(error);
      }
    };

    getCategories();
  }, []);
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-start text-muted">
      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                E-commerce
              </h6>
              <p>
                Thank you for choosing E-commerce. We are committed to providing
                you with an unparalleled shopping experience, offering a wide
                selection of high-quality products at competitive prices. Our
                dedicated team works tirelessly to ensure your satisfaction,
                from the moment you visit our site to the prompt delivery of
                your order. We value your trust and strive to exceed your
                expectations with exceptional customer service and continuous
                innovation. Your journey with us is just the beginning, and we
                look forward to serving you again soon. Happy shopping!
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Categories</h6>
              {categories.map((category) => {
                return (
                  <p>
                    <NavLink to={`/category/${category._id}`}>
                      {" "}
                      {category.name}
                    </NavLink>
                  </p>
                );
              })}
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <p>
                <a href="#!" className="text-reset">
                  Pricing
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Settings
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Orders
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                New York, NY 10012, US
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                info@example.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2024 Copyright:
        <p>E-coomerece</p>
      </div>
    </MDBFooter>
  );
}
