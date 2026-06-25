import React, { useEffect, useState } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing

//action
import { acceptRedeem, getRedeem } from "../../../store/redeem/action";
import { getSetting } from "../../../store/setting/action";

//MUI

//dayjs
import dayjs from "dayjs";

import arraySort from "array-sort";

//sweet alert
import { IconCopy } from "@tabler/icons-react";
import Rcoin from "../../../assets/images/rcoin.webp";
import { usePermission } from "../../../context/PermissionProvider";
import Pagination from "../../../pages/Pagination";
import { Toast } from "../../../util/Toast";

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const PendingRedeemTable = (props) => {
  const dispatch = useDispatch();

  const [coinSort, setCoinSort] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const { can } = usePermission();
  const canCreate = can("admin/userRedeemRequest", "Create");
  const canEdit = can("admin/userRedeemRequest", "Edit");
  const canDelete = can("admin/userRedeemRequest", "Delete");

  useEffect(() => {
    dispatch(getSetting());
    // dispatch(getRedeem("pending" , search , activePage , rowsPerPage));
  }, [dispatch]);

  const redeem = useSelector((state) => state.redeem.redeem);
  const setting = useSelector((state) => state.setting.setting);
  useEffect(() => {
    setData(redeem.redeem);
  }, [redeem]);

  useEffect(() => {
    dispatch(getRedeem("pending", search, activePage, rowsPerPage));
  }, [activePage, rowsPerPage]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleSearch = (e) => {
    // const value = e.target.value.toUpperCase()
    //   ? e.target.value.trim().toUpperCase()
    //   : e.target.value.trim();
    // if (value) {
    //   const data = redeem.filter((data) => {
    //     return (
    //       data?.userId?.name?.toUpperCase()?.indexOf(value) > -1 ||
    //       data?.paymentGateway?.toUpperCase()?.indexOf(value) > -1 ||
    //       data?.description?.toUpperCase()?.indexOf(value) > -1 ||
    //       data?.rCoin?.toString()?.indexOf(value) > -1
    //     );
    //   });
    //   setData(data);
    // } else {
    //   return setData(redeem);
    // }
  };

  const handleAcceptDecline = (id, type) => {
    props.acceptRedeem(id, type);
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "rCoin", { reverse: coinSort });
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div></div>
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="What're you searching for?"
                  className="search-input"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      dispatch(
                        getRedeem("pending", search, activePage, rowsPerPage),
                      );
                      setActivePage(1);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            {/* <div className="table-card-body"> */}
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>User</th>
                      <th>UniqueId</th>
                      <th>Payment Gateway</th>
                      <th>Description</th>
                      <th
                        onClick={handleCoinSort}
                        style={{ cursor: "pointer" }}
                      >
                        RCoin {coinSort ? " ▼" : " ▲"}
                      </th>
                      <th>Amount({setting.currency?.symbol || "$"})</th>
                      <th>CreatedAt</th>
                      {canEdit && <th>Accept</th>}
                      {canEdit && <th>Decline</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      (rowsPerPage > 0
                        ? data.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                        : data
                      ).map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.user?.name}</td>
                            <td>
                              {data?.user?.uniqueId &&
                              data.user.uniqueId !== "-" ? (
                                <>
                                  {data.user.uniqueId}
                                  <IconCopy
                                    size={16}
                                    className="ms-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      copyToClipboard(data.user.uniqueId)
                                    }
                                  />
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>{data.paymentGateway}</td>
                            <td>{data.description}</td>
                            <td>
                              <img
                                src={Rcoin}
                                width="15px"
                                height="15px"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />
                              {data.rCoin}
                            </td>
                            <td>
                              {(data.rCoin / setting.rCoinForCashOut).toFixed(
                                2,
                              )}{" "}
                              {setting.currency?.symbol || "$"}
                            </td>
                            <td>
                              {dayjs(data.createdAt).format("DD MMM, YYYY")}
                            </td>
                            {canEdit && (
                              <td>
                                <button
                                  className="btn-sm edit-btn"
                                  onClick={() =>
                                    handleAcceptDecline(data._id, "accept")
                                  }
                                >
                                  <i className="fa fa-check"></i> Accept
                                </button>
                              </td>
                            )}
                            {canEdit && (
                              <td>
                                <button
                                  className="btn-sm delete-btn"
                                  onClick={() =>
                                    handleAcceptDecline(data._id, "decline")
                                  }
                                >
                                  <i className="fas fa-times"></i> Decline
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" align="center">
                          Nothing to show!!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            {/* </div> */}
            <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={redeem.total}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getRedeem, acceptRedeem, getSetting })(
  PendingRedeemTable,
);
