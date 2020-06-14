import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import paginationFactory from "react-bootstrap-table2-paginator";
import * as ReactBoostrap from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import Dropdown from "react-bootstrap/Dropdown";
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [status, setStatus] = useState(2);
  const [editStatus, setEditStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [editName, setEditName] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [oldPasswordValue, setOldPasswordValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [fullNameValue, setFullNameValue] = useState("");
  const { SearchBar } = Search;

  const getUserData = async () => {
    fetch("http://localhost:8080/api/user/getUserList/2", {
      method: "get",
      headers: new Headers({
        user_login_token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setUsers(response.data);
        setLoading(true);
      });
  };

  const editUser = (row) => {
    setUserId(row.user_id);
    setEditEmail(row.email);
    setEditName(row.full_name);
    setEditInfo(true);
    setEditStatus(row.status);
  };

  const deleteUserInfo = (row) => {
    setUserId(row.user_id);
    setDeleteUser(true);
    setEditName(row.full_name);
    setEditEmail(row.email);
  };

  const deleteUserInformation = () => {
    handleClose();
    setLoading(false);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_login_token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    };
    fetch("http://localhost:8080/api/user/delete", requestOptions)
      .then((res) => res.json())
      .then((response) => {
        getUserData();
      });
  };

  const columnsData = [
    { dataField: "full_name", text: "Name", headerStyle: { width: "13%" } },
    { dataField: "email", text: "Email", headerStyle: { width: "20%" } },
    {
      dataField: "status",
      text: "Status",
      headerStyle: { width: "5%", height: "1px" },
      formatter: (rowContent, row) => {
        return <div>{row.status === 1 ? "Enabled" : "Disabled"}</div>;
      },
    },
    {
      dataField: "createdAt",
      text: "Created At",
      headerStyle: { width: "16%" },
      formatter: (rowContent, row) => {
        var date =
          new Date(row.createdAt).getDate() +
          "-" +
          new Date(row.createdAt).getMonth() +
          "-" +
          new Date(row.createdAt).getFullYear();
        var time =
          new Date(row.createdAt).getHours() +
          ":" +
          new Date(row.createdAt).getMinutes() +
          ":" +
          new Date(row.createdAt).getSeconds();
        var date_time = date + " " + time;
        // date: Date = new Date(row.createdAt);
        return <div>{date_time}</div>;
      },
    },
    {
      dataField: "updatedAt",
      text: "Updated At",
      headerStyle: { width: "16%" },
      formatter: (rowContent, row) => {
        var date =
          new Date(row.createdAt).getDate() +
          "-" +
          new Date(row.createdAt).getMonth() +
          "-" +
          new Date(row.createdAt).getFullYear();
        var time =
          new Date(row.createdAt).getHours() +
          ":" +
          new Date(row.createdAt).getMinutes() +
          ":" +
          new Date(row.createdAt).getSeconds();
        var date_time = date + " " + time;
        // date: Date = new Date(row.createdAt);
        return <div>{date_time}</div>;
      },
    },
    {
      dataField: "link",
      text: "Action",
      headerStyle: { width: "11%" },
      formatter: (rowContent, row) => {
        return (
          <div className="row" style={{ height: "0px" }}>
            <FontAwesomeIcon
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                marginTop: "3px",
                color: "blue",
                cursor: "pointer",
              }}
              icon={faEdit}
              onClick={() => editUser(row)}
            />
            <span>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteUserInfo(row)}
                style={{ color: "red", cursor: "pointer" }}
              />
            </span>
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setShow(false);
    setEditInfo(false);
    setPasswordValue(false);
    setDeleteUser(false);
    setChangePass(false);
    setDeleteUser(false);
  };

  const handleShow = () => setShow(true);
  const handleChangePassword = () => setChangePass(true);

  const handelChangePasswordSubmit = () => {
    handleClose();
    setLoading(false);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_login_token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        old_password: oldPasswordValue,
        password: newPasswordValue,
      }),
    };
    fetch("http://localhost:8080/api/user/changePassword", requestOptions)
      .then((res) => res.json())
      .then((response) => {
        setLoading(true);
      });
  };

  const handleSubmit = () => {
    setLoading(false);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullNameValue,
        email: emailValue,
        password: passwordValue,
      }),
    };
    fetch("http://localhost:8080/api/user/userSignup", requestOptions)
      .then((res) => res.json())
      .then((response) => {
        if (response.responseCode === 1) {
          getUserData();
          handleClose();
        }
      });
  };

  const changeUserInfo = () => {
    var getStatusValue;
    handleClose();
    setLoading(false);
    if (setStatus === 2) {
      getStatusValue = editStatus;
    } else {
      getStatusValue = status;
    }
    // user_id
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user_login_token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: userId,
        full_name: editName,
        email: editEmail,
        status: getStatusValue,
      }),
    };
    fetch("http://localhost:8080/api/user/updateUser/", requestOptions)
      .then((res) => res.json())
      .then((response) => {
        if (response.responseCode === 1) {
          getUserData();
        }
      });
  };

  const logout = () => {
    const {
      history: { push },
    } = this.props;
    localStorage.clear();
    push("../auth/login/Login");
  };

  const allUser = (value) => {
    setLoading(false);
    fetch("http://localhost:8080/api/user/getUserList/" + value, {
      method: "GET",
      headers: new Headers({
        user_login_token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setLoading(false);
        setUsers(response.data);
        setLoading(true);
      });
  };
  useEffect(() => {
    // getUserData();
    getUserData();
  }, []);

  return (
    <div className="Home">
      <form onSubmit={handleSubmit}>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label> Name </label>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Full Name"
                onChange={(e) => setFullNameValue(e.target.value)}
                style={{ margin: "10px" }}
              ></input>
            </div>
            <div>
              <div>
                <label> Email </label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter Email Address"
                  onChange={(e) => setEmailValue(e.target.value)}
                  style={{ margin: "10px" }}
                ></input>
              </div>
            </div>
            <div>
              <label>Password</label>
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPasswordValue(e.target.value)}
                style={{ margin: "10px" }}
              ></input>
            </div>
            <div>
              <label>Confirm Password</label>
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Confirm Password"
                onChange={(e) => setPasswordValue(e.target.value)}
                style={{ margin: "10px" }}
              ></input>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={handleSubmit}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
      <form onSubmit={handleSubmit} className="changePassword">
        <Modal show={changePass} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label> Old Password </label>
              <input
                type="password"
                placeholder="Enter Old Password"
                onChange={(e) => setOldPasswordValue(e.target.value)}
                style={{ margin: "10px" }}
              ></input>
            </div>
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter New Password"
              onChange={(e) => setNewPasswordValue(e.target.value)}
              style={{ margin: "10px" }}
            ></input>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={handelChangePasswordSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
      <form onSubmit={handleSubmit} className="EditInfo">
        <Modal show={editInfo} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label> Full Name </label>
            <input
              type="text"
              placeholder="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ margin: "10px" }}
            ></input>
            <label> Email Address </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              style={{ margin: "10px" }}
            ></input>
            <Dropdown>
              <Dropdown.Toggle>Status</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={(e) => setStatus(1)}>
                  Enable
                </Dropdown.Item>
                <Dropdown.Item onSelect={(e) => setStatus(0)}>
                  Disable
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <div>
              <label>Status</label>
            </div> */}
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={changeUserInfo}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
      <form onSubmit={handleSubmit}>
        <div className="deleteUser">
          <Modal show={deleteUser} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Are You Sure You want to delete ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="labelfullname">
                <label>
                  <b> Full Name</b>{" "}
                </label>
                <div className="fullNameValue">{editName}</div>
              </div>
              <div class="forEmail">
                <label class="emailAddress"> Email address </label>
                <div class="emailValue">{editEmail}</div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color="primary" onClick={deleteUserInformation}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </form>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="primary"
        variant="dark"
        style={{ marginBottom: "60px" }}
      >
        <Navbar.Brand href="#home">Hello Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav>
            <NavDropdown
              title={localStorage.getItem("fullName")}
              id="collasible-nav-dropdown"
              style={{ color: "white", marginRight: "30px" }}
            >
              <NavDropdown.Item onClick={handleChangePassword}>
                Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {loading ? (
        <ToolkitProvider
          keyField="user_id"
          data={users}
          columns={columnsData}
          search
        >
          {(props) => (
            <div className="searchbar">
              <SearchBar {...props.searchProps} />
              <hr />
              <Button
                onClick={handleShow}
                style={{
                  marginTop: "12px",
                  minWidth: "8%",
                  float: "right",
                }}
              >
                Add User
              </Button>
              <Button
                onClick={() => allUser(2)}
                style={{
                  margin: "10px",
                  minWidth: "4%",
                }}
              >
                All
              </Button>
              <Button
                onClick={() => allUser(1)}
                style={{
                  margin: "10px",
                  minWidth: "4%",
                }}
              >
                Enabled
              </Button>
              <Button
                onClick={() => allUser(0)}
                style={{
                  margin: "10px",
                  minWidth: "8%",
                }}
              >
                Disabled
              </Button>
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory()}
              />
            </div>
          )}
        </ToolkitProvider>
      ) : (
        <ReactBoostrap.Spinner animation="border" />
      )}
    </div>
  );
};

export default withRouter(Home);
