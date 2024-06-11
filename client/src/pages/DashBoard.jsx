import NavBar from "./components/NavBar";
import {
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
} from "mdb-react-ui-kit";
import { faBagShopping, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Footer from "./components/Footer";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../axiosInstance";
import { updateSellerData } from "../reducers/authSlice";

// function DashBoard() {
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   return (
//     <div>
//       <NavBar />
// <MDBRow>
//   <MDBCol md="4">
//     <nav aria-label="main mailbox folders">
//       <List>
//         <ListItem onClick={() => setSelectedIndex(1)}>
//           <ListItemButton>
//             <ListItemIcon>
//               <FontAwesomeIcon icon={faBoxesStacked} />
//             </ListItemIcon>
//             <ListItemText primary="Create Product" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </nav>
//   </MDBCol>
//   <MDBCol md="8">{selectedIndex === 1 && <CreateProduct />}</MDBCol>
// </MDBRow>
//     </div>
//   );
// }

function DashBoard() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(authState.seller.firstName);
  const [lastName, setLastName] = useState(authState.seller.lastName);
  const [email, setEmail] = useState(authState.seller.email);
  const [phone, setPhone] = useState(authState.seller.phone);
  const [photo, setPhoto] = useState(authState.seller.photo);
  const [street, setStreet] = useState(authState.seller.address.street);
  const [city, setCity] = useState(authState.seller.address.city);
  const [state, setState] = useState(authState.seller.address.state);
  const [country, setCountry] = useState(authState.seller.address.country);
  const [zip, setZip] = useState(authState.seller.address.zip);
  const [companyName, setCompanyName] = useState(authState.seller.companyName);
  const [businessRegistrationNumber, setbusinessRegistrationNumber] = useState(
    authState.seller.businessRegistrationNumber
  );
  const [bankName, setBankName] = useState(authState.seller.bankName);
  const [accountNumber, setAccountNumber] = useState(
    authState.seller.accountNumber
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/seller/products/sales", {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setTotalAmount(res.data.totalSales);
      setTotalOrders(res.data.totalOrders);
    };
    fetchData();
  }, [authState.token]);

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
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: {
        street: street,
        city: city,
        state: state,
        country: country,
        zip: zip,
      },
      businessRegistrationNumber: businessRegistrationNumber,
      location: [latitude, longitude],
      phone: phone,
      bankName: bankName,
      accountNumber: accountNumber,
      photo: photo,
      companyName: companyName,
    };
    const UserDataUpdate = await axiosInstance.put(
      "/users-update/profile",
      sendData,
      {
        headers: { Authorization: `Bearer ${authState.token}` },
      }
    );
    dispatch(updateSellerData(sendData));
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
                    Total Earnings : {totalAmount}
                  </MDBCardText>
                  <MDBCardText className="mt-2">
                    Total Orders : {totalOrders}
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBListGroup flush className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faBagShopping} />
                      <NavLink to="/manage-products">Manage Products</NavLink>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faBagShopping} />
                      <NavLink to="/manage-orders">Manage Orders</NavLink>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <FontAwesomeIcon icon={faBullhorn} />
                      <NavLink to="/seller-admin">
                        Announcments from Admin
                      </NavLink>
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
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Company Name:</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {companyName}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>GST Number:</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {businessRegistrationNumber}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Bank Name:</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        value={bankName}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Account Number:</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        value={accountNumber}
                        onChange={(e) => setStreet(e.target.value)}
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

export default DashBoard;
