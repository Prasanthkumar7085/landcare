const ValidationsTable = ({ validationsData }: any) => {
  return (
    <div className="validationTableContainer">
      <h2>Uploaded (9)</h2>

      <h2>Not Uploaded {validationsData?.length}</h2>
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
              <th className="cell">Name</th>
              <th className="cell">Position</th>
              <th className="cell">Host Organisation</th>
              <th className="cell">LLS Region</th>
              <th className="cell">Phone</th>
              <th className="cell">Email</th>
              <th className="cell">Location</th>
              <th className="cell">Postcode</th>
              <th className="cell">Error</th>
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
