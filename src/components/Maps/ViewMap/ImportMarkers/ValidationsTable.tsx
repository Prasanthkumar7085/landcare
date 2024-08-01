const ValidationsTable = ({ validationsData }: any) => {
  return (
    <div>
      <h2>Error Table</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {validationsData.map((error: any, index: any) => (
            <tr key={index}>
              <td>{error.name || "N/A"}</td>
              <td>{error.location || "N/A"}</td>
              <td>{error.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ValidationsTable;
