import { useEffect, useState } from "react";
//redux
import { connect, useDispatch, useSelector } from "react-redux";
//action
import { deleteGift, getGift } from "../../store/gift/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useNavigate } from "react-router-dom";
// type
import { OPEN_SVGA_DIALOG } from "../../store/gift/types";
// dialog
import GiftDialog from "../dialog/Gift/Edit";
//sweet alert
import { usePermission } from "../../context/PermissionProvider";
import { warning } from "../../util/Alert";

//all gift
import AllGift from "../../pages/AllGift";

//image
import noImage from "../../assets/images/noImage.png";

import SVGA from "svgaplayerweb";
import AddSvgaDialogue from "../dialog/AddSvgaDialogue";

const GiftTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const category = JSON.parse(sessionStorage.getItem("Category"));

  const GiftClick = sessionStorage.getItem("GiftClick");

  useEffect(() => {
    GiftClick === null
      ? dispatch(getGift(category._id))
      : dispatch(getGift("ALL"));
  }, [GiftClick]);

  const gift = useSelector((state) => state.gift.gift);

  const { can } = usePermission();
  const canCreate = can("admin/gift", "Create");
  const canEdit = can("admin/gift", "Edit");
  const canDelete = can("admin/gift", "Delete");

  useEffect(() => {
    setData(gift);
  }, [gift]);

  useEffect(() => {
    data?.map((admissionSVGA, index) => {
      if (admissionSVGA.image.split(".").pop() === "svga") {
        const player = new SVGA.Player(`div[attr="${index}"]`);
        const parser = new SVGA.Parser();

        parser.load(baseURL + admissionSVGA.image, (videoItem) => {
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
      }
    });
  }, [data]);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = gift.filter((data) => {
        return (
          data?.coin?.toString()?.indexOf(value) > -1 ||
          data?.category?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(gift);
    }
  };

  const handleDelete = (giftId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGift(giftId);
          // alert("Deleted!", `Gift has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_SVGA_DIALOG, payload: data });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_SVGA_DIALOG });
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">
              {GiftClick === null && category.name} Gifts
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
                <li className="breadcrumb-item">
                  <Link to="/admin/giftCategory" className="text-white">
                    Category
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Gift
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      {canCreate && (
        <div className="row">
          <div className="col-12">
            <div className="filter-bar">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div>
                    <button
                      className="edit-btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      New
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                      style={{
                        backgroundColor: "#131929",
                        marginTop: "10px",
                        border: "1px solid #1e2640",
                      }}
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          style={{ color: "#c8cfe0", cursor: "pointer" }}
                          onClick={handleOpen}
                        >
                          SVGA
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          style={{ color: "#c8cfe0", cursor: "pointer" }}
                          onClick={() => {
                            GiftClick === null
                              ? navigate("/admin/giftCategory/gift/dialog")
                              : navigate("/admin/gift/dialog");
                          }}
                        >
                          Image, GIF
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GIFT CARDS ── */}
      <div className="row">
        {data.length > 0 ? (
          data.map((data, index) => {
            return (
              <>
                {GiftClick === null ? (
                  <div
                    className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                    key={index}
                    onClick={() => {
                      sessionStorage.setItem("CategoryId", data._id);
                      navigate("/admin/giftCategory/gift");
                    }}
                  >
                    <div className="card contact-card card-bg">
                      <div className="card-body p-1">
                        <div className="row px-3 py-4">
                          <div className="col-4 ps-4">
                            {data.image.split(".").pop() !== "svga" ? (
                              <img
                                src={
                                  data.image ? baseURL + data.image : noImage
                                }
                                style={{
                                  width: "135px",
                                  height: "135px",
                                  objectFit: "cover",
                                }}
                                alt=""
                                className="rounded-circle my-auto"
                                height={80}
                              />
                            ) : (
                              <div
                                id="svga"
                                attr={index}
                                style={{
                                  width: "135px",
                                  height: "135px",
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                  marginTop: 10,
                                  objectFit: "contain",
                                }}
                                className="rounded-circle my-auto"
                              ></div>
                            )}
                          </div>
                          <div
                            className="col-8 pe-4 text-end"
                            style={{ padding: 0, paddingLeft: 5 }}
                          >
                            <div className="contact-card-info mt-2 mb-3 px-3 mb-5">
                              <h2 className="text-white">Coin: {data.coin}</h2>
                              {GiftClick !== null && (
                                <h6>{data.category.name}</h6>
                              )}
                            </div>
                            <div className="px-3 d-flex gap-2 justify-content-end">
                              {canEdit && (
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fa fa-edit fa-lg"></i>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i className="fas fa-trash-alt fa-lg"></i>
                                </button>
                              )}
                            </div>
                            {/* <div className="px-3">
                              {canEdit && (
                                <i
                                  className="fas fa-edit text-white p-2 bg-primary rounded-circle"
                                  style={{ marginRight: 10, fontSize: 25 }}
                                  onClick={() => handleEdit(data)}
                                ></i>
                              )}
                              {canDelete && (
                                <i
                                  className="fas fa-trash text-white p-2 bg-danger rounded-circle"
                                  style={{ marginRight: 10, fontSize: 25 }}
                                  onClick={() => handleDelete(data._id)}
                                ></i>
                              )}
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="row order-md-1 order-last mt-4">
                      <h3 className="mb-3 text-white">{data.name} Gifts</h3>
                      <AllGift data={data} />
                    </div>
                  </>
                )}
              </>
            );
          })
        ) : (
          <tr>
            <td colSpan="6" align="center">
              Nothing to show!!
            </td>
          </tr>
        )}
      </div>

      <GiftDialog />
      <AddSvgaDialogue />
    </>
  );
};

export default connect(null, { getGift, deleteGift })(GiftTable);
