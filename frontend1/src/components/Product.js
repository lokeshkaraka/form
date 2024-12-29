import React, { useState } from "react";
import { Button, Form, Input, Upload, message, Table, Card } from "antd";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './ProductStyles.css';
import logo from './SchemXBlackLogo.png';
import dayjs from 'dayjs';
import {  Checkbox } from 'antd';

const Product = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm();
    const [emailList, setEmailList] = useState([]);
    const [, setAttachment] = useState(null);
    const [, setFile] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [checked, setChecked] = useState(false); // Checkbox state
    const [isSendEnabled, setIsSendEnabled] = useState(false); // B

    const currentMonthYear = dayjs().format('MMMM YYYY');

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Extract headers and rows
                const headers = jsonData[0];
                const rows = jsonData.slice(1);

                // Generate table columns dynamically
                const tableColumns = headers.map((header, index) => ({
                    title: header || `Column ${index + 1}`,
                    dataIndex: index, // Use the column index as key
                    key: index,
                    render: (text) => text || "-", // Show "-" if the cell is empty
                }));

                // Map rows to objects for the table
                const tableData = rows.map((row, rowIndex) => {
                    const rowObject = {};
                    headers.forEach((_, colIndex) => {
                        rowObject[colIndex] = row[colIndex]; // Use column index as key
                    });
                    rowObject.key = rowIndex; // Add a unique key for each row
                    return rowObject;
                });

                setColumns(tableColumns);
                setExcelData(tableData);
            } catch (error) {
                console.error("Error processing the file:", error);
                alert("Failed to process the file. Please ensure it is a valid Excel file.");
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleCheckboxChange = (e) => {
        setChecked(e.target.checked);
        setIsSendEnabled(e.target.checked);
    };
    const handleAttachmentUpload = (file) => {
        setAttachment(file);
        return false;
    };




    const excelDateToJSDate = (serial) => {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date = new Date(utc_value * 1000);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };


    const generatePaySlipPDF = async (employeeData) => {
        const doc = new jsPDF();

        const htmlContent = `
           <div style="font-family: Arial, sans-serif; width: 600px;height:800px; margin: 0 auto; padding: 20px; ">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src=${logo} alt="Company Logo" style="width: 400px; height: 80px; margin-bottom: 10px;">
                        <h1 style="font-size: 12px; margin: 0;">SCHEMAX EXPERT TECHNO CRAFTS PRIVATE LIMITED</h1>
                    </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid black;">
                    <tr>
                        <td colspan="4" style="padding: 3px; background-color: skyblue; text-align: center; font-size: 12px; font-weight: bold; color: black;">
                            Pay Slip for the month of DECEMBER' 2024
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Employee ID:</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[2] || 'N/A'}</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Gender:</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[10] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Employee Name:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[2] || 'N/A'}</td>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Date of Joining:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[6] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Band:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[11] || 'N/A'}</td>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">ESI/Insurance Number:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[15] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Designation:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[4] || 'N/A'}</td>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">PAN No:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[9] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Location:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">Visakhapatnam</td>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Bank A/C Number:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[7] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">Bank Name:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">HDFC Bank</td>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">UAN No:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[16] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">LOP Days:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">0</td>
                        <td style="padding: 2px; font-size: 10px; font-weight: bold; border: 1px solid black;">No of Days Paid:</td>
                        <td style="padding: 2px; font-size: 10px; border: 1px solid black;">${excelDateToJSDate(employeeData[12]) || 'N/A'}</td>
                    </tr>

                    <tr style="background-color: skyblue;text-align: center;font-weight:bold">
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Earnings</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Amount</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Employee Deductions</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Amount</td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Basic</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[18] || 0}</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Professional Tax</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[24] || 0}</td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">HRA</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[19] || 0}</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">TDS</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[25] || 0}</td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Travel Allowance</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[20] || 0}</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Provident Fund</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[26] || 0}</td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Medical Allowance</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[21] || 0}</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">ESIC</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[27] || 0}</td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Special Allowance</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[22] || 0}</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Salary Advance</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[29] || 0}</td>
                    </tr>
                    <tr>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Others</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">0</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Other Allowance (V. Pay)</td>
                        <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[30] || 0}</td>
                    </tr>
                    <tfoot>
                        <tr>
                            <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Gross Earnings</td>
                            <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[17] || 0}</td>
                            <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Total Deductions</td>
                            <td style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[31] || 0}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">Net Pay</td>
                            <td colspan="2" style="width: 25%; padding: 2px; font-size: 10px; border: 1px solid black;">${employeeData[33] || 0}</td>
                        </tr>
                    <tr>
                            <td colspan="4" style="width: 25%;text-align:center; padding: 2px; font-size: 10px; border: 1px solid black;">**This is a computer-generated pay slip and does not require any signature.</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.top = "-10000px";
        element.innerHTML = htmlContent;
        document.body.appendChild(element);

        try {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 10, 10, 190, 250);
        } finally {
            document.body.removeChild(element);
        }

        return doc.output("blob");
    };


    const handleSubmit = async () => {
        const { subject, matter } = form.getFieldsValue();

        if (!subject || !matter || emailList.length === 0) {
            message.error("Please fill all fields and upload an email list.");
            return;
        }
        const loadingMessage = message.loading("Sending emails, please wait...", 0);
        try {
            for (let i = 0; i < excelData.length; i++) {
                const employeeData = excelData[i];

                const pdfBlob = await generatePaySlipPDF(employeeData);

                // Prepare form data
                const formData = new FormData();
                formData.append("subject", subject);
                formData.append("matter", matter);
                formData.append("senderEmail", user.email);
                formData.append("attachment", pdfBlob, `paySlip_${employeeData[3] || 'Unknown'}.pdf`);
                formData.append("emails", JSON.stringify([employeeData[5]]));

                // Send the email via API
                await axios.post("http://localhost:3001/api/send-emails", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            loadingMessage();

            message.success("Emails sent successfully!");
            setEmailList([]);
            form.resetFields();
        } catch (error) {
            console.error("Error while sending emails:", error);
            loadingMessage();
            message.error("Failed to send emails. Check the server logs.");
        }
    };

    const handleExcelRemove = () => {
        setEmailList([]);
        setFile(null);
    };

    return (
        <div >
            <Card>
                <h2 className="welcome">
                    Welcome, <span className="mail">{user?.email || "Guest"}</span>
                </h2>

                <Form form={form} initialValues={{
                    subject: 'Hello!',
                    matter: `Kindly find attached the payslip for the month of  ${currentMonthYear}`,
                }} layout="vertical" style={{ width: '500px', alignItems: 'center' }}>
                    <Form.Item
                        name="subject"
                        label={<span style={{ color: '#386641', fontWeight: 'bold' }}>Subject</span>}
                       
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="matter"
                        label={<span style={{ color: '#386641', fontWeight: 'bold' }}>Description/Body</span>}
                       
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>


                        <div style={{ flex: "1" }}>
                            <Form.Item
                                name="uploadExcel"
                                label={<span style={{ color: "#386641", fontWeight: "bold", }}>Upload  Employees PaySlip Details</span>}
                            >
                                <Upload
                                    beforeUpload={(file) => handleFileUpload(file) && false}
                                    showUploadList={{
                                        showRemoveIcon: true,
                                        onRemove: handleExcelRemove,
                                    }}
                                >
                                    <Button>Upload here! 📤</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                        <div style={{ flex: "1" }}>
                            <Form.Item
                                name="attachment"
                                hidden
                                label={<span style={{ color: "#386641", fontWeight: "bold" }}>Attachment</span>}
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
                    </div>
                </Form>
                <br />

                <Table
                    title={() => "Check Details Once! 😊"}
                    dataSource={excelData}
                    columns={columns}
                    bordered
                    pagination={{ pageSize: 10 }}
                    style={{ marginTop: 20 }}
                    scroll={{ x: true }}
                />


                <br />
                <Form.Item>
                    <Checkbox checked={checked} onChange={handleCheckboxChange}>
                        I agree to send emails
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        disabled={!isSendEnabled} 
                        onClick={handleSubmit} >
                        Send Emails
                    </Button>
                </Form.Item>
            </Card>
        </div>
    );
};

export default Product;