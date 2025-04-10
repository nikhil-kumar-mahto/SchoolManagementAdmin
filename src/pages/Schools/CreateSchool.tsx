import React, { ChangeEvent, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "./Schools.module.css";
import Layout from "../../components/common/Layout/Layout";

interface Props {}

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  subject: "",
};

const CreateSchool: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form data:", data);
    // Add your form submission logic here
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Create School</h2>
        <div className={styles.row}>
          <div className={styles.column}>
            <Input
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter teacher's name"
            />
          </div>
          <div className={styles.column}>
            <Input
              label="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter teacher's email"
              type="email"
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <Input
              label="Phone"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Enter teacher's phone number"
            />
          </div>
          <div className={styles.column}>
            <Input
              label="Address"
              name="address"
              value={data.address}
              onChange={handleChange}
              placeholder="Enter teacher's address"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <Input
              label="Subject"
              name="subject"
              value={data.subject}
              onChange={handleChange}
              placeholder="Enter teacher's subject"
            />
          </div>
        </div>

        <Button text="Submit" onClick={handleSubmit} className="mt-2" />
      </div>  
    </Layout>
  );
};

export default CreateSchool;
