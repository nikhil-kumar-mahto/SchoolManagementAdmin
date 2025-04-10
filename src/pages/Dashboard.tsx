import { useState } from "react";
import DataTable from "../components/common/DataTable/DataTable";
import Select from "../components/common/Select/Select";
import SearchDebounce from "../components/common/Search/Search";

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

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
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
      <DataTable />
    </div>
  );
}

export default Dashboard;
