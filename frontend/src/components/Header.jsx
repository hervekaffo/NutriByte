import { Navbar, Nav, Container, NavDropdown, Badge, Image } from "react-bootstrap";
import { FaUser, FaUtensils as FaKitchenSet, FaBullseye } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { apiSlice } from "../slices/apiSlice";
import SearchBox from "./SearchBox";
import { resetMeal } from "../slices/mealSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mealItems } = useSelector((state) => state.meal);
  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());            // ⬅️ clear RTK Query cache
      dispatch(resetMeal());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // Total items in current meal
  const mealCount = mealItems.reduce((sum, item) => sum + item.qty, 0);

  const mealTitle = (
    <>
      <FaKitchenSet /> My Meal
      {mealCount > 0 && (
        <Badge pill bg="success" style={{ marginLeft: "5px" }}>
          {mealCount}
        </Badge>
      )}
    </>
  );

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/images/logo.png"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
              alt="Logo"
            />
            NutiByte
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <Nav.Link as={Link} to="/goals">
                <FaBullseye /> My Goal
              </Nav.Link>
              {userInfo && (
                <NavDropdown title={mealTitle} id="mealmenu">
                  <NavDropdown.Item as={Link} to="/meal">
                    Build Meal
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/savelogs">
                    Save Meal Log
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/nutrition-logs">
                    View Nutrition Logs
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {userInfo ? (
                <NavDropdown
                  title={
                    <>
                      <Image
                        src={
                          userInfo.picture
                            ? userInfo.picture
                            : "/images/user_images/default.jpg"
                        }
                        roundedCircle
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                          marginRight: "8px",
                        }}
                      />
                      {userInfo.name}
                    </>
                  }
                  id="username"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/mealloglist">
                    Meals Log
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
