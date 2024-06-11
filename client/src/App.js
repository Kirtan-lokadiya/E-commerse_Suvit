import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Electronics from "./pages/Electronics";
import Grocery from "./pages/Grocery";
import Furniture from "./pages/Furniture";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import WishList from "./pages/WishList";
import Support from "./pages/Support";
import PrivateRoute from "./pages/components/PrivateRoute";
import SellerSignup from "./pages/SellerSignup";
import SellerLogin from "./pages/SellerLogin";
import SuperAdmin from "./pages/SuperAdmin";
import AdminOnlyRoute from "./pages/components/AdminOnlyRoute";
import DashBoard from "./pages/DashBoard";
import PaymentSuccessfull from "./pages/PaymentSuccessfull";
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/ManageOrders";
import SellerSupport from "./pages/Admin_to_Seller/SellerSupport";

function App() {
  const authState = useSelector((state) => state.auth);
  useEffect(
    function () {
      sessionStorage.setItem("token", JSON.stringify(authState));
    },
    [authState]
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/seller-signup" element={<SellerSignup />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route
            path="/category/:id"
            element={<PrivateRoute element={Electronics} />}
          />
          <Route path="/grocery" element={<PrivateRoute element={Grocery} />} />
          <Route
            path="/furniture"
            element={<PrivateRoute element={Furniture} />}
          />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route
            path="/product/:id"
            element={<PrivateRoute element={Product} />}
          />
          <Route path="/orders" element={<PrivateRoute element={Orders} />} />
          <Route path="/cart" element={<PrivateRoute element={Cart} />} />
          <Route
            path="/wishlist"
            element={<PrivateRoute element={WishList} />}
          />
          <Route
            path="/payment/success/:id"
            element={<PrivateRoute element={PaymentSuccessfull} />}
          />
          <Route path="/support" element={<PrivateRoute element={Support} />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={DashBoard} />}
          />
          <Route
            path="/manage-products"
            element={<PrivateRoute element={ManageProducts} />}
          />
          <Route
            path="/manage-orders"
            element={<PrivateRoute element={ManageOrders} />}
          />
          <Route path="/seller-admin" element={<PrivateRoute element={SellerSupport} />} />
          <Route
            path="/super-admin"
            element={<AdminOnlyRoute element={SuperAdmin} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
