import './App.css';
import React, { useState } from "react";
import { signInWithGoogle } from './firebaseConfig';
import { Button, Form, Input, Upload, message, Table } from "antd";
import axios from "axios";
import * as XLSX from "xlsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [emailList, setEmailList] = useState([]);
  const [attachment, setAttachment] = useState(null); // Store attachment
  const [file, setFile] = useState(null);

  const handleLogin = async () => {
    try {
      const loggedInUser = await signInWithGoogle();
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const emails = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat();
      setEmailList(emails);
    };
    reader.readAsArrayBuffer(file);
    setFile(file);
  };

  const handleAttachmentUpload = (file) => {
    setAttachment(file); // Save the file for sending later
    return false; // Prevent Upload component from automatically uploading
  };

  const handleSubmit = async () => {
    const { subject, matter } = form.getFieldsValue();
  
    if (!subject || !matter || emailList.length === 0) {
      message.error("Please fill all fields and upload an email list.");
      return;
    }
  
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("matter", matter);
    if (attachment) {
      formData.append("attachment", attachment); // Include the attachment
    }
    formData.append("emails", JSON.stringify(emailList)); // Send email list as JSON string
    formData.append("senderEmail", user.email); // Include the logged-in user's email
  
    try {
      await axios.post("http://localhost:3001/api/send-emails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Emails sent successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to send emails.");
    }
  };

  if (!user) {
    return <Button onClick={handleLogin}>Login with Google</Button>;
  }

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <Form form={form} layout="vertical">
        <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="matter" label="Matter" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="attachment" label="Attachment">
          <Upload
            maxCount={1}
            beforeUpload={handleAttachmentUpload}
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button>Upload Attachment (PDF)</Button>
          </Upload>
        </Form.Item>
      </Form>
      <Upload beforeUpload={(file) => handleFileUpload(file) && false}>
        <Button>Upload Excel (Emails)</Button>
      </Upload>
      <Table
        dataSource={emailList.map((email, index) => ({ key: index, email }))}
        columns={[{ title: "Email", dataIndex: "email", key: "email" }]}
      />
      <Button type="primary" onClick={handleSubmit}>
        Send Emails
      </Button>
    </div>
  );
};

export default App;