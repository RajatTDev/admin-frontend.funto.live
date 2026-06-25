import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import $ from "jquery";
import SVGA from "svgaplayerweb";
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";
import {
  deleteAdmissionSVGA,
  getAdmissionSVGA,
} from "../../store/AdmissionCar/action";
import { OPEN_DIALOGUE_ADMISSION_CAR } from "../../store/AdmissionCar/type";
import {  warning } from "../../util/Alert";
import { baseURL } from "../../util/Config";
import AdmissionCarDialogue from "../dialog/AdmissionCarDialogue";

const AdmissionCar = (props) => {
  const dispatch = useDispatch();

  const { admissionSVGA } = useSelector((state) => state.admissionSVGA);
  const { can } = usePermission();
  const canCreate = can("admin/entryEffect", "Create");
  const canEdit = can("admin/entryEffect", "Edit");
  const canDelete = can("admin/entryEffect", "Delete");

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getAdmissionSVGA("svga"));
  }, [dispatch]);

  useEffect(() => {
    setData(admissionSVGA);
  }, [admissionSVGA]);

  useEffect(() => {
    if (data && data.length > 0) {
      data.map((admissionSVGA, index) => {
        if (admissionSVGA?.image.split(".").pop() === "svga") {
          const player = new SVGA.Player(`div[attr="${index}"]`);
          const parser = new SVGA.Parser();
          parser.load(baseURL + admissionSVGA?.image, (videoItem) => {
            player?.setVideoItem(videoItem);
            player?.startAnimation();
          });
        }
      });
    } else {
      // Handle the case when data is not available or is an empty array
      console.warn("No valid data to process.");
    }
  }, [data]);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = admissionSVGA.filter((data) => {
        return (
          data?.diamond?.toString()?.indexOf(value) > -1 ||
          data?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(admissionSVGA);
    }
  };

  const handleOpen = () => {
    dispatch({
      type: OPEN_DIALOGUE_ADMISSION_CAR,
      payload: { data: null, type: "open" },
    });
  };

  const handleEdit = (data) => {

    dispatch({
      type: OPEN_DIALOGUE_ADMISSION_CAR,
      payload: { data: data, type: "edit" },
    });
  };

  const handleDelete = (id) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteAdmissionSVGA(id);
        }
      })
      .catch((err) => console.log(err));
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", `${baseURL}storage/male.png`);
    });
  });

  return (
    <div style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Entry Effect</h3>
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
                  Admission Car
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── SEARCH/ACTION BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              {/* Left — New button */}
              <div className="d-flex align-items-center gap-2">
                {canCreate && (
                  <button
                    type="button"
                    className="edit-btn"
                    id="bannerDialog"
                    onClick={handleOpen}
                  >
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                )}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="What're you searching for?"
                  aria-describedby="button-addon4"
                  className="search-input"
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARDS GRID ── */}
      <div className="row mt-4">
        {data?.length > 0 ? (
          data.map((data, index) => {
            return (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                <div
                  style={{
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,77,141,0.3)";
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1F2937";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.4)";
                  }}
                  className="card contact-card h-100 card-bg"
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="flex-shrink-0">
                        {data.image.split(".").pop() !== "svga" ? (
                          <img
                            src={data.image ? baseURL + data.image : noImage}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                              // border: "2px solid #1e2640",
                            }}
                            alt=""
                            className="rounded-circle"
                            // height={80}
                          />
                        ) : (
                          <div
                            id="svga"
                            attr={index}
                            style={{
                              width: "150px",
                              height: "150px",
                              // boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
                              // marginTop: 10,
                              // objectFit: "cover",
                            }}
                            className="rounded-circle"
                          ></div>
                        )}
                      </div>
                      <div
                        className="flex-grow-1"
                        // style={{ padding: 0, paddingLeft: 5 }}
                      >
                        <h4 className="text-white mb-2">{data?.name}</h4>
                        {/* <div className="mt-2 mb-3 px-3 mb-5"> */}
                          <div className="mb-1 d-flex align-items-center gap-1">
                            <h4 className="text-white">
                              Diamonds: {data?.diamond}
                            </h4>
                          </div>
                          <div className="mb-1 d-flex align-items-center gap-1">
                            <h4 className="text-white">
                              Validity:{" "}
                              {data?.validity + " " + data?.validityType}
                            </h4>
                          </div>
                        {/* </div> */}

                        <div className="d-flex gap-2 mt-2">
                          {canEdit && (
                            <button
                              type="button"
                              className="edit-btn btn-circle  m-b-xs"
                              onClick={() => handleEdit(data)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-circle delete-btn m-b-xs"
                              onClick={() => handleDelete(data?._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

      <AdmissionCarDialogue />
    </div>
  );
};

export default connect(null, { getAdmissionSVGA, deleteAdmissionSVGA })(
  AdmissionCar,
);
