import DataTable from "../components/common/DataTable/DataTable";

function Dashboard() {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <h2>DataTable Sample</h2>
      <DataTable />
    </div>
  );
}

export default Dashboard;
