const ValidationsTable = ({ validationsData }: any) => {
  return (
    <div className="validationTableContainer">
      <h2>Uploaded (9)</h2>

      <h2>Not Uploaded {validationsData?.length}</h2>
      <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Host Organisation</th>
            <th>LLS Region</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Location</th>
            <th>Postcode</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {validationsData.map((error: any, index: any) => (
            <tr key={index}>
              <td>{error.name || "N/A"}</td>
              <td>{error.position || "N/A"}</td>
              <td>{error.host_organization || "N/A"}</td>
              <td>{error.lls_region || "N/A"}</td>
              <td>{error.phone || "N/A"}</td>
              <td>{error.email.slice(0, 9) || "N/A"}</td>
              <td>{error.location || "N/A"}</td>
              <td>{error.post_code || "N/A"}</td>
              <td>{error.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
export default ValidationsTable;
