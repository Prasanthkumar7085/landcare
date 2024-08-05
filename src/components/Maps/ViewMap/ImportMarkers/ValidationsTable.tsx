import { Typography } from "@mui/material";

const ValidationsTable = ({ validationsData }: any) => {
  return (
    <div className="validationTableContainer" id="validationTable">
      <div className="validationHead">
        <Typography variant="h5">Files</Typography>
        <div className="importInfo">
          <Typography className="uploaded">Uploaded <span>9</span> </Typography>
          <Typography className="failed">Failed  <span>{validationsData?.length}</span></Typography>
        </div>
        <div></div>
      </div>
      <div className="tableContainer">
        <table className="table" >
          <thead className="thead" style={{
            height: "32px",
            position: "sticky",
            top: "0px",
            zIndex: "2",
            color: "white",
          }}>
            <tr className="table-row">
              <th className="cell" style={{minWidth:"150px"}}>Name</th>
              <th className="cell" style={{ minWidth: "200px" }}>Position</th>
              <th className="cell" style={{ minWidth: "200px" }}>Host Organisation</th>
              <th className="cell" style={{ minWidth: "150px" }}>LLS Region</th>
              <th className="cell" style={{ minWidth: "120px" }}>Phone</th>
              <th className="cell" style={{ minWidth: "180px" }}>Email</th>
              <th className="cell" style={{ minWidth: "180px" }}>Location</th>
              <th className="cell" style={{ minWidth: "100px" }}>Postcode</th>
              <th className="cell" style={{ minWidth: "250px" }}>Error</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {validationsData.map((error: any, index: any) => (
              <tr className="table-row" key={index}>
                <td className="cell">{error.name || "N/A"}</td>
                <td className="cell">{error.position || "N/A"}</td>
                <td className="cell">{error.host_organization || "N/A"}</td>
                <td className="cell">{error.lls_region || "N/A"}</td>
                <td className="cell">{error.phone || "N/A"}</td>
                <td className="cell">{error.email.slice(0, 9) || "N/A"}</td>
                <td className="cell">{error.location || "N/A"}</td>
                <td className="cell">{error.post_code || "N/A"}</td>
                <td className="cell">{error.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ValidationsTable;
