import { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { deleteCategory, getCategory } from "../../store/giftCategory/action";

//config
import { baseURL } from "../../util/Config";
//routing
import { Link, useNavigate } from "react-router-dom";
// type
import { OPEN_CATEGORY_DIALOG } from "../../store/giftCategory/types";
// dialog
import GiftCategoryDialog from "../dialog/GiftCategory";
//sweet alerte
import { alert, warning } from "../../util/Alert";

//image
import noImage from "../../assets/images/noImage.png";
import { usePermission } from "../../context/PermissionProvider";

const GiftCategoryTable = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const giftCategory = useSelector((state) => state.giftCategory.giftCategory);

  const { can } = usePermission();
  const canCreate = can("admin/giftCategory", "Create");
  const canEdit = can("admin/giftCategory", "Edit");
  const canDelete = can("admin/giftCategory", "Delete");

  useEffect(() => {
    setData(giftCategory);
  }, [giftCategory]);

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = giftCategory.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.giftCount?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(giftCategory);
    }
  };

  const handleOpen = () => {

    dispatch({ type: OPEN_CATEGORY_DIALOG });
  };

  const handleDelete = (categoryId) => {

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteCategory(categoryId);
          alert("Deleted!", `Category has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_CATEGORY_DIALOG, payload: data });
  };

  const openGifts = (data) => {

    sessionStorage.setItem("Category", JSON.stringify(data));
    navigate("/admin/giftCategory/gift");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Category</h3>
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
                  Category
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="main-wrapper">
        {/* ── FILTER BAR ── */}
        {canCreate && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="filter-bar">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={handleOpen}
                      id="bannerDialog"
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          {data.length > 0 ? (
            data.map((data, index) => {
              return (
                <div
                  className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                  key={index}
                >
                  <div
                    style={{
                      boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,77,141,0.3)";
                      e.currentTarget.style.boxShadow = `0 10px 30px rgba(255,77,141,0.25)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#1F2937";
                      e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(0,0,0,0.4)";
                    }}
                    className="card contact-card card-bg pointer-cursor"
                  >
                    <div className="card-body text-center">
                      <img
                        src={data.image ? baseURL + data.image : noImage}
                        alt=""
                        draggable="false"
                        className="mx-auto shadow rounded-circle"
                        style={{
                          height: "100px",
                          width: "100px",
                          obejctFit: "cover",
                          display: "block",
                        }}
                        onClick={() => openGifts(data)}
                      />

                      <div
                        className="contact-card-info"
                        onClick={() => openGifts(data)}
                      >
                        <h6>{data.name}</h6>
                        <span>
                          {data.giftCount ? data.giftCount : "0"} Gifts
                        </span>
                      </div>
                      <div className="contact-card-buttons d-flex gap-3 justify-content-center">
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
                            onClick={() => handleDelete(data._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
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
      </div>
      <GiftCategoryDialog />
    </>
  );
};

export default connect(null, { getCategory, deleteCategory })(
  GiftCategoryTable,
);
