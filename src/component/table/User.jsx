import { useEffect, useState } from "react";

//dayjs
import dayjs from "dayjs";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getUser, handleBlockUnblockSwitch } from "../../store/user/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";

// import arraySort from "array-sort";

//image
import Male from "../../assets/images/male.png";

//pagination
import Pagination from "../../pages/Pagination";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//h
import { IconCopy } from "@tabler/icons-react";
import { MdNotificationsActive } from "react-icons/md";
import Diamond from "../../assets/images/diamond.png";
import Rcoin from "../../assets/images/rcoin.webp";
import { usePermission } from "../../context/PermissionProvider";
import { OPEN_NOTIFICATION_DIALOG } from "../../store/notification/types";
import { Toast } from "../../util/Toast";

const UserTable = (props) => {
  const navigate = useNavigate();
  const maxDate = new Date();
  const dispatch = useDispatch();
  const { user, activeUser, male, female, totalUser } = useSelector(
    (state) => state.user,
  );

  const { can } = usePermission();
  const canCreate = can("admin/user", "Create");
  const canEdit = can("admin/user", "Edit");
  const canDelete = can("admin/user", "Delete");

  const [data, setData] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limit, setLimit] = useState("");
  const [search, setSearch] = useState("ALL");
  const [diamondSort, setDiamondSort] = useState("asc");
  const [rCoinSort, setRcoindSort] = useState("asc");

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return [
      {
        startDate: startOfMonth,
        endDate: endOfMonth,
        key: "selection",
      },
    ];
  });

  // const [sDate, setsDate] = useState(() => {
  //   const startOfMonth = new Date();
  //   startOfMonth.setDate(1);
  //   return dayjs(startOfMonth).format('YYYY/M/DD');
  // });

  // const [eDate, seteDate] = useState(() => {
  //   const endOfMonth = new Date();
  //   endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
  //   return dayjs(endOfMonth).format('YYYY/M/DD');
  // });

  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  // Add formatted date variables
  const formattedStart =
    sDate === "ALL" ? "ALL" : dayjs(sDate).format("YYYY/M/DD");
  const formattedEnd =
    eDate === "ALL" ? "ALL" : dayjs(eDate).format("YYYY/M/DD");

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const datePicker = document.getElementById("datePicker");
      const toggleButton = document.getElementById("datePickerToggleButton");
      if (
        datePicker &&
        !datePicker.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        $("#datePicker").css("display", "none");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setData(user);
  }, [user]);

  useEffect(() => {
    dispatch(
      getUser(activePage, rowsPerPage, search, formattedStart, formattedEnd),
    );
  }, [activePage, rowsPerPage, formattedStart, formattedEnd]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker");
    setData(user);
  }, [date]);
  // }, [date, user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page"));
    const limitNum = parseInt(urlParams.get("limit"));

    if (!isNaN(page) && page > 0) {
      setActivePage(page);
    }
    if (!isNaN(limitNum) && limitNum > 0) {
      setRowsPerPage(limitNum);
      setLimit(limitNum);
    }

    if (page && limitNum) {
      dispatch(getUser(page, limitNum, search, formattedStart, formattedEnd));
    }
  }, [window.location.search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleBlockUnblockSwitch_ = (userId) => {
    props.handleBlockUnblockSwitch(userId);
  };

  // const handleUserInfo = (user) => {
  //   sessionStorage.setItem('user', JSON.stringify(user));
  //   navigate('/admin/user/detail');
  // };
  // const handleUserHistory = (user) => {
  //   sessionStorage.setItem('user', JSON.stringify(user));
  //   navigate('/admin/user/history');
  // };

  const getAllUser = () => {
    setActivePage(1);
    setRowsPerPage(10);
    setSearch("ALL");
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    dispatch(getUser(activePage, rowsPerPage, search, sDate, eDate));
  };

  const collapsedDatePicker = () => {
    if (windowWidth < 575) {
      setShowModal(true);
    } else {
      const datePicker = $("#datePicker");
      if (datePicker.css("display") === "none") {
        datePicker.css("display", "block");
      } else {
        datePicker.css("display", "none");
      }
    }
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", Male);
    });
  });

  const handleDateFilter = () => {
    setActivePage(1);
    $("#datePicker").css("display", "none");
    dispatch(
      getUser(activePage, rowsPerPage, search, formattedStart, formattedEnd),
    );
    setsDate("ALL");
    seteDate("ALL");
  };

  const handleDaimondSort = () => {
    setDiamondSort((prev) => (prev === "asc" ? "desc" : "asc"));
    dispatch(
      getUser(
        activePage,
        rowsPerPage,
        search,
        formattedStart,
        formattedEnd,
        diamondSort ? diamondSort : null,
        rCoinSort ? rCoinSort : null,
      ),
    );
  };
  const handlerCoinSort = () => {
    setRcoindSort((prev) => (prev === "asc" ? "desc" : "asc"));
    dispatch(
      getUser(
        activePage,
        rowsPerPage,
        search,
        formattedStart,
        formattedEnd,
        diamondSort ? diamondSort : null,
        rCoinSort ? rCoinSort : null,
      ),
    );
  };

  const handleOpen = (userId) => {
    setSelectedUserId(userId);

    dispatch({
      type: OPEN_NOTIFICATION_DIALOG,
      payload: userId,
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const trimmedValue = value.trim().toUpperCase();

    if (trimmedValue) {
      const filtered = user.filter((data) => {
        return (
          data?.name?.toUpperCase()?.includes(trimmedValue) ||
          data?.uniqueId?.toString()?.includes(trimmedValue) ||
          data?.gender?.toString()?.toUpperCase()?.includes(trimmedValue) ||
          data?.diamond?.toString()?.includes(trimmedValue)
        );
      });
      setData(filtered);
    } else {
      setData(user);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(
        getUser(activePage, rowsPerPage, search, formattedStart, formattedEnd),
      );
      setActivePage(1);
    }
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light" style={{ color: "#e4eeff" }}>
              User
            </h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-white">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Stats cards — unchanged */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
              e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1F2937";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
            }}
            className="card stats-card"
          >
            <div className="card-body">
              <div className="stats-info">
                <h5 className="card-title">{male ? male : 0}</h5>
                <p className="stats-text">Male</p>
              </div>
              <div className="stats-icon change-danger">
                <i className="material-icons">male</i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
              e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1F2937";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
            }}
            className="card stats-card"
          >
            <div className="card-body">
              <div className="stats-info">
                <h5 className="card-title">{female ? female : 0}</h5>
                <p className="stats-text">Female</p>
              </div>
              <div className="stats-icon change-success">
                <i className="material-icons">female</i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
              e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1F2937";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
            }}
            className="card stats-card"
          >
            <div className="card-body">
              <div className="stats-info">
                <h5 className="card-title">{activeUser}</h5>
                <p className="stats-text">Total Active User</p>
              </div>
              <div className="stats-icon change-pink">
                <i className="material-icons">people</i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between flex-wrap gap-2">
              {/* Left — All + Analytics buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  className="edit-btn"
                  style={{ marginRight: 5 }}
                  onClick={getAllUser}
                >
                  All
                </button>
                <button
                  id="datePickerToggleButton"
                  className="edit-btn collapsed"
                  value="check"
                  data-toggle="collapse"
                  data-target="#datePicker"
                  onClick={collapsedDatePicker}
                >
                  Analytics
                  <ExpandMoreIcon style={{ fontSize: 18, marginLeft: 4 }} />
                </button>
                <p style={{ paddingLeft: 10 }} className="my-2 text-secondary">
                  {formattedStart !== "ALL" &&
                    formattedStart + " to " + formattedEnd}
                </p>
              </div>

              {/* Right — Search */}
              <div className="search-wrapper w-100 w-md-auto">
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="What're you searching for?"
                  className="search-input"
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
                <i
                  className="fas fa-search search-icon"
                  // style={{ left: "auto", right: 12 }}
                  onClick={() => {
                    const searchValue =
                      document.getElementById("searchBar")?.value;
                  }}
                ></i>
              </div>
            </div>

            {/* Date picker — unchanged */}
            <div
              id="datePicker"
              className="date-picker-wrapper mt-3"
              aria-expanded="false"
              style={{ display: "none" }}
            >
              <div className="container table-responsive">
                <div key={JSON.stringify(date)}>
                  <DateRangePicker
                    maxDate={maxDate}
                    onChange={(item) => {
                      setDate([item.selection]);
                      const dayStart = dayjs(item.selection.startDate).format(
                        "YYYY/M/DD",
                      );
                      const dayEnd = dayjs(item.selection.endDate).format(
                        "YYYY/M/DD",
                      );
                      setsDate(dayStart);
                      seteDate(dayEnd);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    direction="horizontal"
                  />
                </div>
                <div className="mt-3">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#e8538f",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 20px",
                      fontWeight: "bold",
                      border: "none",
                    }}
                    onClick={handleDateFilter}
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card" id="card">
            {/* <div className="table-card-body"> */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table table-striped text-center">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>UniqueId</th>
                    <th>Gender</th>
                    <th onClick={handlerCoinSort} style={{ cursor: "pointer" }}>
                      Rcoin {rCoinSort === "asc" ? " ▼" : " ▲"}
                    </th>
                    <th
                      onClick={handleDaimondSort}
                      style={{ cursor: "pointer" }}
                    >
                      Diamond {diamondSort === "asc" ? " ▼" : " ▲"}
                    </th>
                    <th>Country</th>
                    <th>Level</th>
                    {canEdit && <th>isBlock</th>}
                    <th>isHost</th>
                    <th>Agency</th>
                    <th>Info</th>
                    <th>History</th>
                    {canEdit && <th>Notification</th>}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data?.image ? data?.image : Male}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = male;
                              }}
                              style={{
                                border: "2px solid #1e2640",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                              className="mx-auto"
                            />
                          </td>
                          <td>{data?.name ? data?.name : "-"}</td>
                          <td>
                            {data?.uniqueId ? data?.uniqueId : "-"}
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(
                                  data?.uniqueId ? data?.uniqueId : "-",
                                )
                              }
                            />
                          </td>
                          <td>
                            {data?.gender ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  justifyContent: "center",
                                }}
                              >
                                {data.gender.toLowerCase() === "male" && (
                                  <i className="material-icons text-primary">
                                    male
                                  </i>
                                )}
                                {data.gender.toLowerCase() === "female" && (
                                  <i className="material-icons text-danger">
                                    female
                                  </i>
                                )}
                                <span className="text-capitalize">
                                  {data.gender}
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-danger">
                            <img
                              src={Rcoin}
                              width="15px"
                              height="15px"
                              style={{
                                verticalAlign: "middle",
                                marginRight: "1px",
                              }}
                            />{" "}
                            {data?.rCoin ? data?.rCoin : "0"}
                          </td>
                          <td className="text-danger">
                            <img
                              src={Diamond}
                              width="15"
                              height="15"
                              style={{
                                verticalAlign: "middle",
                                marginRight: "1px",
                              }}
                            />{" "}
                            {data?.diamond ? data?.diamond : "0"}
                          </td>
                          <td className="text-success">
                            {data?.country ? data?.country : "-"}
                          </td>
                          <td className="text-warning">
                            {data?.level?.name ? data?.level?.name : "-"}
                          </td>
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data?.isBlock}
                                  onChange={() => {
                                    handleBlockUnblockSwitch_(data?._id);
                                  }}
                                />
                                <span className="slider">
                                  <p
                                    style={{
                                      fontSize: 12,
                                      marginLeft: `${data.isBlock ? "-24px" : "35px"}`,
                                      color: "#000",
                                      marginTop: "6px",
                                    }}
                                  ></p>
                                </span>
                              </label>
                            </td>
                          )}
                          <td>{data?.isHost === false ? "No" : "Yes"}</td>
                          <td>
                            {data?.hostAgency ? data?.hostAgency?.name : "-"}
                          </td>
                          <td>
                            <Tooltip title="Info">
                              <button
                                type="button"
                                className="btn-sm edit-btn"
                                onClick={() => {
                                  sessionStorage.setItem(
                                    "user",
                                    JSON.stringify({
                                      ...data,
                                      currentPage: activePage,
                                      currentRowsPerPage: rowsPerPage,
                                    }),
                                  );
                                  navigate("/admin/user/detail");
                                }}
                              >
                                <i className="fas fa-info-circle fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip title="History">
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  background: "#0f766e",
                                  color: "#99f6e4",
                                  border: "none",
                                }}
                                onClick={() => {
                                  sessionStorage.setItem(
                                    "user",
                                    JSON.stringify({
                                      ...data,
                                      currentPage: activePage,
                                      currentRowsPerPage: rowsPerPage,
                                      source: "user",
                                    }),
                                  );
                                  navigate("/admin/user/history");
                                }}
                              >
                                <i className="fas fa-history fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>

                          {canEdit && (
                            <td>
                              <button
                                type="button"
                                className="btn-sm delete-btn"
                                onClick={() => handleOpen(data._id)}
                              >
                                <span className="icon_margin">
                                  <MdNotificationsActive size={20} />
                                </span>
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalUser}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: "#131929",
            color: "#fff",
            borderRadius: "15px",
            border: "1px solid #1e2640",
            margin: "10px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          className="d-flex justify-content-between align-items-center"
          style={{ borderBottom: "1px solid #1e2640", padding: "15px 20px" }}
        >
          <h6 className="m-0 text-white" style={{ fontWeight: 500 }}>
            Select Date Range
          </h6>
          <IconButton
            onClick={() => setShowModal(false)}
            size="small"
            style={{ color: "#fff" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: "0" }}>
          <div className="d-flex flex-column">
            <div
              className="rdr-mobile-wrapper"
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <DateRangePicker
                maxDate={maxDate}
                onChange={(item) => {
                  setDate([item.selection]);
                  const dayStart = dayjs(item.selection.startDate).format(
                    "YYYY/M/DD",
                  );
                  const dayEnd = dayjs(item.selection.endDate).format(
                    "YYYY/M/DD",
                  );
                  setsDate(dayStart);
                  seteDate(dayEnd);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={date}
                direction="vertical"
              />
            </div>
            <div className="p-3" style={{ borderTop: "1px solid #1e2640" }}>
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: "#e8538f",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  border: "none",
                }}
                onClick={() => {
                  handleDateFilter();
                  setShowModal(false);
                }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { getUser, handleBlockUnblockSwitch })(UserTable);
