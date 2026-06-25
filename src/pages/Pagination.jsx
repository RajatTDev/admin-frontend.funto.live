//pagination
import TablePagination from "react-js-pagination";

const Pagination = (props) => {
  const handlePage = (page) => {
    props.handlePageChange(page);
  };
  const handleRowsPerPage = (value) => {
    props.handleRowsPerPage(value);
  };

  return (
    <>
      {/* <div className="d-md-flex justify-content-between px-5">
        <div className="d-flex align-items-center">
          <span className="mx-0">Rows</span>
          <select
            className="form-select form-control mr-3 ml-2 mb-2 mb-md-0 mb-lg-0"
            style={{ marginLeft: 5, maxHeight: 40 }}
            defaultValue="10"
            onChange={(e) => {
              handleRowsPerPage(e.target.value);
            }}
          >
            <option className="text-white" value="5">
              5
            </option>
            <option className="text-white" value="10">
              10
            </option>
            <option className="text-white" value="25">
              25
            </option>
            <option className="text-white" value="50">
              50
            </option>
            <option className="text-white" value="100">
              100
            </option>
          </select>
        </div>
        <div className="align-middle">
          <TablePagination
            activePage={props.activePage}
            itemsCountPerPage={props.rowsPerPage}
            totalItemsCount={props.userTotal || 0}
            pageRangeDisplayed={2}
            onChange={(page) => handlePage(page)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div> */}

      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between py-3 gap-3">
        <div className="d-flex align-items-center order-1">
          <span className="text-white opacity-75">Rows per page :</span>
          <select
            className="form-select form-control ms-2"
            style={{
              maxHeight: 40,
              width: "auto",
              backgroundColor: "#1f1f2b",
              color: "#fff",
              borderColor: "#2e303a",
            }}
            defaultValue="10"
            onChange={(e) => {
              handleRowsPerPage(e.target.value);
            }}
          >
            {[5, 10, 25, 50, 100].map((val) => (
              <option key={val} value={val} className="bg-dark">
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-center order-1 order-md-2">
          <TablePagination
            activePage={props.activePage}
            itemsCountPerPage={Number(props.rowsPerPage) || 0}
            totalItemsCount={props.userTotal || 0}
            pageRangeDisplayed={2}
            onChange={(page) => handlePage(page)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    </>
  );
};

export default Pagination;
