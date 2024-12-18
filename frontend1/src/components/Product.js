// import './App.css';
import React, { useState } from "react";
// import { signInWithGoogle } from '../firebaseConfig';
import { Button, Form, Input, Upload, message, Table, Card } from "antd";
import axios from "axios";
import * as XLSX from "xlsx";
import './ProductStyles.css';

const Product = () => {
    // const user = location.state?.user;
    const user = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm();
    const [emailList, setEmailList] = useState([]);
    const [attachment, setAttachment] = useState(null);
    const [, setFile] = useState(null);

    // const handleLogin = async () => {
    //     try {
    //         const loggedInUser = await signInWithGoogle();
    //         setUser(loggedInUser);
    //     } catch (error) {
    //         console.error("Login failed", error);
    //     }
    // };

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
        setAttachment(file);
        return false;
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
        // formData.append("senderEmail", user.email);
        if (attachment) {
            formData.append("attachment", attachment);
        }
        formData.append("emails", JSON.stringify(emailList));
        formData.append("senderEmail", user.email);

        try {
            await axios.post("http://localhost:3001/api/send-emails", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            message.success("Emails sent successfully!");
            setEmailList([]);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error("Failed to send emails.");
        }
    };

    const handleExcelRemove = () => {
        setEmailList([]);
        setFile(null);
    };

    // if (!user) {
    //     return <Button onClick={handleLogin}>Login with Google</Button>;
    // }

    return (
        <div>
            <Card>
                <h2 className="welcome">
                    Welcome, <span className="mail">{user?.email || "Guest"}</span>
                </h2>

                <Form form={form} layout="vertical" style={{ width: '500px', alignItems: 'center' }}>
                    <Form.Item
                        name="subject"
                        label={<span
                            style={{ color: '#386641', fontWeight: 'bold' }}
                        >
                            Subject
                        </span>}
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="matter"
                        label={<span
                            style={{ color: '#386641', fontWeight: 'bold' }}
                        >
                            Description/Body
                        </span>}
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ flex: "1" }}>
                            <Form.Item
                                name="attachment"
                                label={<span
                                    style={{ color: "#386641", fontWeight: "bold" }}
                                >
                                    Attachment
                                </span>}
                            >
                                <Upload
                                    maxCount={1}
                                    beforeUpload={handleAttachmentUpload}
                                    showUploadList={{ showRemoveIcon: true }}
                                >
                                    <Button>Upload Attachment (PDF)</Button>
                                </Upload>
                            </Form.Item>
                        </div>

                        <div style={{ flex: "1" }}>
                            <Form.Item
                                name="uploadExcel"
                                label={<span
                                    style={{ color: "#386641", fontWeight: "bold" }}
                                >
                                    Upload Mail List
                                </span>}
                            >
                                <Upload
                                    beforeUpload={(file) => handleFileUpload(file) && false}
                                    showUploadList={{
                                        showRemoveIcon: true,
                                        onRemove: handleExcelRemove,
                                    }}
                                >
                                    <Button>Upload Excel (Emails)</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
                <br />
                <Table
                    // style={{ width: '1000px' }}
                    dataSource={emailList.map((email, index) => ({ key: index, email }))}
                    columns={[{
                        title: <span style={{ color: '#f2e9e4', fontSize: '17px' }}>Emails</span>,
                        dataIndex: "email",
                        key: "email",
                        onHeaderCell: () => ({
                            style: {
                                backgroundColor: '#778da9',
                                color: '#ffffff',
                            },
                        }),
                    }]}
                />
                <br />
                <Button onClick={handleSubmit} className="button-mail">
                    Send Emails
                </Button>
            </Card>
        </div>
    );
};

export default Product;

















