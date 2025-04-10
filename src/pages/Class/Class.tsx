import { useState } from "react";
import Layout from "../../components/common/Layout/Layout";
import Select from "../../components/common/Select/Select";
import SearchDebounce from "../../components/common/Search/Search";
import DataTable from "../../components/common/DataTable/DataTable";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

function Class() {
  const [selectedValue, setSelectedValue] = useState("option1");
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <Layout>
      <div
        style={{
          height: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>Classes</h2>
        <Select
          options={options}
          value={selectedValue}
          onChange={setSelectedValue}
          label="Select an Option"
        />
        <SearchDebounce onSearch={handleSearch} debounceDelay={300} />
        <DataTable />
      </div>
    </Layout>
  );
}

export default Class;
