import Layout from "../components/common/Layout/Layout";

function Dashboard() {
  return (
    <Layout>
      <div
        style={{
          height: "calc(100vh - 9rem)",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center ",
        }}
      >
        <h1 className="flex-center">Coming Soon</h1>
      </div>
    </Layout>
  );
}

export default Dashboard;
