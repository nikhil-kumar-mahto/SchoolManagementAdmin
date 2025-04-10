import { useState } from "react";
import Select from "../components/common/Select/Select";
import SearchDebounce from "../components/common/Search/Search";
import Layout from "../components/common/Layout/Layout";
import Loader from "../components/common/Loader/Loader";
import Button from "../components/common/Button/Button";
import { useToast } from "../contexts/Toast";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

function Dashboard() {
  const [selectedValue, setSelectedValue] = useState("option1");
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };
  const toast = useToast();

  const showToast = () => {
    toast.show("Custom Toast", 3000, "#4CAF50")
  }

  return (
    <Layout>
      <Loader size="medium" color="blue" text="Loading..." />

      <div
        style={{
          height: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>DataTable Sample</h2>
        <Select
          options={options}
          value={selectedValue}
          onChange={setSelectedValue}
          label="Select an Option"
        />
        <SearchDebounce onSearch={handleSearch} debounceDelay={300} />
        <Button
          text="Demo"
          onClick={() => {
            showToast();
          }}
        />
      </div>
    </Layout>
  );
}

export default Dashboard;
