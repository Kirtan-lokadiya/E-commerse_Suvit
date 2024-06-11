import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBInput,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../reducers/authSlice";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCartShopping,
  faHeart,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import axiosInstance from "../axiosInstance";
export default function Profile() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(authState.user.firstName);
  const [lastName, setLastName] = useState(authState.user.lastName);
  const [email, setEmail] = useState(authState.user.email);
  const [phone, setPhone] = useState(authState.user.phone);
  const [photo, setPhoto] = useState(authState.user.photo);
  const [street, setStreet] = useState(authState.user.address.street);
  const [city, setCity] = useState(authState.user.address.city);
  const [state, setState] = useState(authState.user.address.state);
  const [country, setCountry] = useState(authState.user.address.country);
  const [zip, setZip] = useState(authState.user.address.zip);
  // const [coordinates, setCoordinates] = useState(authState.user.location.coordinates);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    setLatitude(crd.latitude);
    setLongitude(crd.longitude);
  }

  function errors(err) {
    alert(`ERROR(${err.code}): ${err.message}`);
  }
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            alert("Location permission is compulsory");
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  function handleImageUpload(e) {
    // console.log("helo");
    let base64String;
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      setPhoto(base64String);
    };
    reader.readAsDataURL(file);
  }
  async function UpdateUserData() {
    const sendData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      address: {
        street: street,
        city: city,
        state: state,
        country: country,
        zip: zip,
      },
      location: [latitude, longitude],
      phone: phone,
      photo: photo,
    };
    dispatch(updateUserData(sendData));
    const UserDataUpdate = await axiosInstance.put(
      "/users-update/profile-update",
      sendData,
      {
        headers: { Authorization: `Bearer ${authState.token}` },
      }
    );
    alert(UserDataUpdate.data.message);
  }
  return (
    <>
      <NavBar />
      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={`data:image/png;base64,${photo}`}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "150px" }}
                    fluid
                  />
                  <MDBCardText className="mt-2">
                    Total Orders : {authState.ordersCount}
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBListGroup flush className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faBagShopping} />
                      <NavLink to="/orders">Orders</NavLink>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faHeart} />
                      <NavLink to="/wishlist">WishList</NavLink>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faCartShopping} />
                      <NavLink to="/cart">Cart</NavLink>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faPhone} />
                      <NavLink to="/support">Support</NavLink>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Full Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="3">
                      <MDBInput
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </MDBCol>
                    <MDBCol sm="3">
                      <MDBInput
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{email}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Phone Number</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBRow>
                        <MDBCol sm="6" className="address-cols">
                          <MDBInput
                            label="Street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol sm="6" className="address-cols">
                          <MDBInput
                            label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol sm="6" className="address-cols">
                          <MDBInput
                            label="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol sm="6" className="address-cols">
                          <MDBInput
                            label="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol sm="6" className="address-cols">
                          <MDBInput
                            label="Zip"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                          />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Photo</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="file"
                        onChange={(e) => handleImageUpload(e)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBBtn onClick={UpdateUserData}>Save</MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <Footer />
    </>
  );
}
