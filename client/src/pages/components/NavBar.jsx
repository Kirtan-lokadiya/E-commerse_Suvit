import NavDropdown from "react-bootstrap/NavDropdown";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../axiosInstance";
import { MDBCardText } from "mdb-react-ui-kit";
import { logoutBoth } from "../../reducers/authSlice";

const fetchMainCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories/main");
    return response.data;
  } catch (error) {
    console.error("Error fetching main categories:", error);
    throw error;
  }
};

const fetchSubCategories = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}/subcategories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState({}); // State to store subcategories

  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchMainCategories();
        setCategories(data);

        // Fetch subcategories for each main category
        const subCategoriesData = await Promise.all(
          data.map(async (category) => {
            const subData = await fetchSubCategories(category._id);
            return { [category._id]: subData };
          })
        );

        // Merge all subcategories into one object
        const mergedSubCategories = subCategoriesData.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        setSubCategories(mergedSubCategories);
      } catch (error) {
        alert(error);
      }
    };

    getCategories();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function handleLogout() {
    let response;
    try {
      if (authState.seller.email === "") {
        response = await axiosInstance.post(
          `/auth/customer/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await axiosInstance.post(
          `/auth/customer/logoutseller`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      }

      if (response.status === 200) {
        // Update authState
        dispatch(logoutBoth());
        alert("Logout successful");
        // Redirect to login page
        navigate("/");
      } else {
        alert("Logout failed:", response);
      }
    } catch (error) {
      alert("Error during logout:", error);
    }
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <NavLink style={{ color: "white" }} to="/">
              E-commerce
            </NavLink>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {categories.map((category) => (
                <React.Fragment key={category._id}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        {category.name}
                      </AccordionSummary>
                      <AccordionDetails>
                        {subCategories[category._id] ? (
                          subCategories[category._id].map((sub) => (
                            <Typography key={sub._id}>{sub.name}</Typography>
                          ))
                        ) : (
                          <Typography>Loading...</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                  <hr />
                </React.Fragment>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            E-commerce
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <NavDropdown title="Categories" id="basic-nav-dropdown">
              {categories.map((category) => (
                <React.Fragment key={category._id}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Accordion style={{ width: "200px" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <NavLink to={`/category/${category._id}`}>
                          {category.name}
                        </NavLink>
                      </AccordionSummary>
                      <AccordionDetails>
                        {subCategories[category._id] ? (
                          subCategories[category._id].map((sub) => (
                            <Typography key={sub._id}>{sub.name}</Typography>
                          ))
                        ) : (
                          <Typography>Loading...</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                  <hr />
                </React.Fragment>
              ))}
            </NavDropdown>
          </Box>
          {authState.token !== "" && authState.user.email !== "" && (
            <>
              <NavLink
                to="/cart"
                style={{ color: "white", marginRight: "1rem" }}
              >
                <FontAwesomeIcon icon={faCartShopping} />
              </NavLink>
              <NavLink
                to="/wishlist"
                style={{ color: "white", marginRight: "1rem" }}
              >
                <FontAwesomeIcon icon={faHeart} />
              </NavLink>
            </>
          )}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon alt="Remy Sharp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {authState.token === "" ? (
                <MenuItem key="login" onClick={handleCloseUserMenu}>
                  <NavLink to="/login" textAlign="center">
                    Login
                  </NavLink>
                </MenuItem>
              ) : (
                ""
              )}

              {authState.user.email !== "" ? (
                <MenuItem key="profile" onClick={handleCloseUserMenu}>
                  <NavLink to="/profile" textAlign="center">
                    Profile
                  </NavLink>
                </MenuItem>
              ) : null}
              {authState.seller.email !== "" ? (
                <MenuItem key="dashboard" onClick={handleCloseUserMenu}>
                  <NavLink to="/dashboard" textAlign="center">
                    Dashboard
                  </NavLink>
                </MenuItem>
              ) : null}
              {authState.token !== "" ? (
                <MenuItem key="logout">
                  <MDBCardText textAlign="center" onClick={handleLogout}>
                    Logout
                  </MDBCardText>
                </MenuItem>
              ) : null}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
