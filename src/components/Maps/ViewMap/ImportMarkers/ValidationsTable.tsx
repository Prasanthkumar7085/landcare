import { Typography } from "@mui/material";

const ValidationsTable = ({ validationsData }: any) => {
  return (
    <div className="validationTableContainer" id="validationTable">
      <div className="validationHead">
        <Typography variant="h5">Files</Typography>
        <div className="importInfo">
          <Typography className="uploaded">
            Uploaded <span>{validationsData[0]?.length}</span>{" "}
          </Typography>
          <Typography className="failed">
            Failed <span>{validationsData[1]?.length}</span>
          </Typography>
        </div>
        <div></div>
      </div>
      <div className="tableContainer">
        <table className="table">
          <thead
            className="thead"
            style={{
              height: "32px",
              position: "sticky",
              top: "0px",
              zIndex: "2",
              color: "white",
            }}
          >
            <tr className="table-row">
              <th className="cell" style={{ minWidth: "150px" }}>
                Title
              </th>
              <th className="cell" style={{ minWidth: "200px" }}>
                Organisation Type
              </th>
              <th className="cell" style={{ minWidth: "200px" }}>
                Website
              </th>
              <th className="cell" style={{ minWidth: "120px" }}>
                Phone
              </th>
              <th className="cell" style={{ minWidth: "180px" }}>
                Email
              </th>
              <th className="cell" style={{ minWidth: "100px" }}>
                Town
              </th>
              <th className="cell" style={{ minWidth: "180px" }}>
                Coordinates
              </th>
              <th className="cell" style={{ minWidth: "250px" }}>
                Error
              </th>
            </tr>
          </thead>
          <tbody className="tbody">
            {validationsData?.[1].map((error: any, index: any) => (
              <tr className="table-row" key={index}>
                <td className="cell">{error?.title || "N/A"}</td>
                <td className="cell">{error?.organisation_type || "N/A"}</td>
                <td className="cell">{error?.website || "N/A"}</td>
                <td className="cell">{error?.phone || "N/A"}</td>
                <td className="cell">{error?.email?.slice(0, 9) || "N/A"}</td>
                <td className="cell">{error?.town || "N/A"}</td>
                <td className="cell">{`${error?.coordinates}` || "N/A"}</td>
                <td className="cell" style={{ color: "red" }}>
                  {error.error}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ValidationsTable;
