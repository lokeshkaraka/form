// import React, { useState } from "react";
// import { Button, Form, Input, Upload, message, Table, Card } from "antd";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import './ProductStyles.css';

// const Product = () => {
//     // const user = location.state?.user;
//     const user = JSON.parse(localStorage.getItem("user"));
//     const [form] = Form.useForm();
//     const [emailList, setEmailList] = useState([]);
//     const [attachment, setAttachment] = useState(null);
//     const [, setFile] = useState(null);


//     const handleFileUpload = (file) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             try {
//                 const data = new Uint8Array(event.target.result);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//                 const headers = jsonData[0];
//                 const emailIndex = headers.findIndex((header) => header && header.toLowerCase() === "email");

//                 if (emailIndex === -1) {
//                     alert("No 'Email' column found in the uploaded Excel file.");
//                     return;
//                 }
//                 const emails = jsonData.slice(1)
//                     .map((row) => row[emailIndex])
//                     .filter((email) => email);

//                 setEmailList(emails);
//             } catch (error) {
//                 console.error("Error processing the file:", error);
//                 alert("Failed to process the file. Please ensure it is a valid Excel file.");
//             }
//         };

//         reader.readAsArrayBuffer(file);
//         setFile(file);
//     };


//     const handleAttachmentUpload = (file) => {
//         setAttachment(file);
//         return false;
//     };

//     const handleSubmit = async () => {
//         const { subject, matter } = form.getFieldsValue();

//         if (!subject || !matter || emailList.length === 0) {
//             message.error("Please fill all fields and upload an email list.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("subject", subject);
//         formData.append("matter", matter);
//         // formData.append("senderEmail", user.email);
//         if (attachment) {
//             formData.append("attachment", attachment);
//         }
//         formData.append("emails", JSON.stringify(emailList));
//         formData.append("senderEmail", user.email);

//         try {
//             await axios.post("http://localhost:3001/api/send-emails", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             message.success("Emails sent successfully!");
//             setEmailList([]);
//             form.resetFields();
//         } catch (error) {
//             console.error(error);
//             message.error("Failed to send emails.");
//         }
//     };

//     const handleExcelRemove = () => {
//         setEmailList([]);
//         setFile(null);
//     };

//     return (
//         <div>
//             <Card>
//                 <h2 className="welcome">
//                     Welcome, <span className="mail">{user?.email || "Guest"}</span>
//                 </h2>

//                 <Form form={form} layout="vertical" style={{ width: '500px', alignItems: 'center' }}>
//                     <Form.Item
//                         name="subject"
//                         label={<span
//                             style={{ color: '#386641', fontWeight: 'bold' }}
//                         >
//                             Subject
//                         </span>}
//                         rules={[{ required: true }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="matter"
//                         label={<span
//                             style={{ color: '#386641', fontWeight: 'bold' }}
//                         >
//                             Description/Body
//                         </span>}
//                         rules={[{ required: true }]}
//                     >
//                         <Input.TextArea />
//                     </Form.Item>

//                     <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//                         <div style={{ flex: "1" }}>
//                             <Form.Item
//                                 name="attachment"
//                                 label={<span
//                                     style={{ color: "#386641", fontWeight: "bold" }}
//                                 >
//                                     Attachment
//                                 </span>}
//                             >
//                                 <Upload
//                                     maxCount={1}
//                                     beforeUpload={handleAttachmentUpload}
//                                     showUploadList={{ showRemoveIcon: true }}
//                                 >
//                                     <Button>Upload Attachment (PDF)</Button>
//                                 </Upload>
//                             </Form.Item>
//                         </div>

//                         <div style={{ flex: "1" }}>
//                             <Form.Item
//                                 name="uploadExcel"
//                                 label={<span
//                                     style={{ color: "#386641", fontWeight: "bold" }}
//                                 >
//                                     Upload Mail List
//                                 </span>}
//                             >
//                                 <Upload
//                                     beforeUpload={(file) => handleFileUpload(file) && false}
//                                     showUploadList={{
//                                         showRemoveIcon: true,
//                                         onRemove: handleExcelRemove,
//                                     }}
//                                 >
//                                     <Button>Upload Excel (Emails)</Button>
//                                 </Upload>
//                             </Form.Item>
//                         </div>
//                     </div>
//                 </Form>
//                 <br />
//                 <Table
//                     dataSource={emailList.map((email, index) => ({ key: index, email }))}
//                     columns={[{
//                         title: <span style={{ color: '#f2e9e4', fontSize: '17px' }}>Emails</span>,
//                         dataIndex: "email",
//                         key: "email",
//                         onHeaderCell: () => ({
//                             style: {
//                                 backgroundColor: '#778da9',
//                                 color: '#ffffff',
//                             },
//                         }),
//                     }]}
//                 />
//                 <br />
//                 <Button onClick={handleSubmit} className="button-mail">
//                     Send Emails
//                 </Button>
//             </Card>
//         </div>
//     );
// };

// export default Product;




















import React, { useState } from "react";
import { Button, Form, Input, Upload, message, Table, Card } from "antd";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";  // Library for generating PDF
import html2canvas from "html2canvas";
import './ProductStyles.css';

const Product = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm();
    const [emailList, setEmailList] = useState([]);
    const [, setAttachment] = useState(null);
    const [, setFile] = useState(null);
    const [excelData, setExcelData] = useState([]);

    // Handle file upload (Excel)
    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const headers = jsonData[0];
                const emailIndex = headers.findIndex((header) => header && header.toLowerCase() === "email");

                if (emailIndex === -1) {
                    alert("No 'Email' column found in the uploaded Excel file.");
                    return;
                }

                const dataRows = jsonData.slice(1).map(row => {
                    const email = row[emailIndex];
                    return { ...row, email };
                });

                setExcelData(dataRows); // Store parsed data
                setEmailList(dataRows.map(row => row.email)); // Update email list
            } catch (error) {
                console.error("Error processing the file:", error);
                alert("Failed to process the file. Please ensure it is a valid Excel file.");
            }
        };

        reader.readAsArrayBuffer(file);
        setFile(file);
    };

    // Handle attachment upload
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


    // const generatePaySlipPDF = (employeeData) => {
    //     const doc = new jsPDF();

    //     // Set up the document title
    //     doc.setFontSize(16);
    //     doc.text("SCHEMAX EXPERT TECHNO CRAFTS PRIVATE LIMITED", 10, 10);
    //     doc.setFontSize(14);
    //     doc.text("Pay Slip for the month of OCTOBER' 2024", 10, 20);

    //     // Employee details
    //     doc.setFontSize(12);
    //     doc.text(`Employee ID: ${employeeData[2] || 'N/A'}`, 10, 30); // Employee ID
    //     doc.text(`Employee Name: ${employeeData[3] || 'N/A'}`, 10, 40); // Name
    //     doc.text(`Band: ${employeeData[11] || 'N/A'}`, 10, 50); // S.NO (Employee Code)
    //     doc.text(`Sub Band: ${employeeData[12] || 'N/A'}`, 10, 60); // S.NO (Employee Code)
    //     doc.text(`Designation: ${employeeData[4] || 'N/A'}`, 10, 70); // Designation
    //     doc.text('Location:Visakhapatnam', 10, 80); // Designation
    //     doc.text(`Bank Name: ${employeeData[8] || 'N/A'}`, 10, 90); // Bank Name
    //     doc.text(`LOP Days: ${employeeData[14] || 'N/A'}`, 10, 100); // Bank Name

    //     const doj = employeeData[6] ? excelDateToJSDate(employeeData[6]) : 'N/A';

    //     // Bank and location details
    //     doc.text(`Gender: ${employeeData[10] || 'N/A'}`, 120, 30); // Gender
    //     doc.text(`Date of Joining: ${doj}`, 120, 40); // DOJ - Converted Date
    //     doc.text(`ESI/Insurance Number: ${employeeData[15] || 'N/A'}`, 120, 50); // Email
    //     doc.text(`PAN No: ${employeeData[9] || 'N/A'}`, 120, 60); // PAN Number
    //     doc.text(`Bank A/C Number: ${employeeData[7] || 'N/A'}`, 120, 70); // Bank A/C Number
    //     doc.text(`UAN No: ${employeeData[16] || 'N/A'}`, 120, 80); // UAN Number
    //     doc.text(`No of Days Paid: ${employeeData[13] || 'N/A'}`, 120, 90); // UAN Number


    //     // Earnings and deductions
    //     let startY = 120;
    //     doc.text("Earnings", 10, startY);
    //     doc.text("Amount", 60, startY);
    //     doc.text("Employee Deductions", 120, startY);
    //     doc.text("Amount", 180, startY);

    //     startY += 10;
    //     const earnings = [
    //         { label: "Basic", value: employeeData[18] },
    //         { label: "HRA", value: employeeData[19] },
    //         { label: "Travel Allowance", value: employeeData[20] },
    //         { label: "Medical Allowance", value: employeeData[21] },
    //         { label: "Special Allowance", value: employeeData[22] },
    //         { label: "Other Allowance", value: employeeData[23] },
    //     ];
    //     const deductions = [
    //         { label: "Professional Tax", value: employeeData[24] },
    //         { label: "TDS", value: employeeData[25] },
    //         { label: "Employee PF Contribution", value: employeeData[26] },
    //         { label: "Employee ESI Contribution", value: employeeData[27] },
    //         { label: "Salary Advance", value: employeeData[29] },
    //     ];

    //     earnings.forEach((item, index) => {
    //         doc.text(`${item.label}:`, 10, startY + index * 10);
    //         doc.text(`${item.value || 0}`, 60, startY + index * 10);
    //     });

    //     deductions.forEach((item, index) => {
    //         doc.text(`${item.label}:`, 120, startY + index * 10);
    //         doc.text(`${item.value || 0}`, 180, startY + index * 10);
    //     });

    //     // Gross and Net Pay
    //     startY += Math.max(earnings.length, deductions.length) * 10 + 10;
    //     doc.text(`Gross Earnings: ${employeeData[17] || 0}`, 10, startY); // Gross Earnings
    //     doc.text(`Net Pay: ${employeeData[33] || 0}`, 120, startY); // Net Pay

    //     // Footer
    //     startY += 20;
    //     doc.setFontSize(10);
    //     doc.text("**This is a computer-generated pay slip and does not require any signature.", 10, startY);

    //     return doc.output("blob"); // Returns a PDF Blob
    // };




    const generatePaySlipPDF = async (employeeData) => {
        const doc = new jsPDF();

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
                <h1 style="text-align: center;">SCHEMAX EXPERT TECHNO CRAFTS PRIVATE LIMITED</h1>
                <h2 style="text-align: center;">Pay Slip for the month of OCTOBER' 2024</h2>
        
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td>Employee ID: ${employeeData[2] || 'N/A'}</td>
                        <td>Gender: ${employeeData[10] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Employee Name: ${employeeData[3] || 'N/A'}</td>
                        <td>Date of Joining: ${employeeData[6] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Band: ${employeeData[11] || 'N/A'}</td>
                        <td>ESI/Insurance Number: ${employeeData[15] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Designation: ${employeeData[4] || 'N/A'}</td>
                        <td>PAN No: ${employeeData[9] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Location: Visakhapatnam</td>
                        <td>Bank A/C Number: ${employeeData[7] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Bank Name: HDFC Bank</td>
                        <td>UAN No: ${employeeData[16] || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>LOP Days: 0</td>
                        <td>No of Days Paid: ${employeeData[13] || 'N/A'}</td>
                    </tr>
                </table>
        
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Earnings</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Amount</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Employee Deductions</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Basic</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[18] || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">Professional Tax</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[24] || 0}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">HRA</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[19] || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">TDS</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[25] || 0}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Travel Allowance</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[20] || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">Provident Fund</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[26] || 0}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Medical Allowance</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[21] || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">ESIC</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[27] || 0}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Special Allowance</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[22] || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">Salary Advance</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[29] || 0}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Others</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">Other Allowance (V. Pay)</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[30] || 0}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Gross Earnings</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[17] || 0}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">Total Deductions</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${employeeData[31] || 0}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">Net Pay</td>
                            <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">${employeeData[33] || 0}</td>
                        </tr>
                    </tfoot>
                </table>
        
                <p style="text-align: center; font-size: 12px; margin-top: 20px;">
                    **This is a computer-generated pay slip and does not require any signature.
                </p>
            </div>
        `;

        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.top = "-10000px"; // Hide it
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

        try {
            for (let i = 0; i < excelData.length; i++) {
                const employeeData = excelData[i];

                // Generate PDF for this employee
                const pdfBlob = await generatePaySlipPDF(employeeData);

                // Prepare form data
                const formData = new FormData();
                formData.append("subject", subject);
                formData.append("matter", matter);
                formData.append("senderEmail", user.email); // Sender's email
                formData.append("attachment", pdfBlob, `paySlip_${employeeData[3] || 'Unknown'}.pdf`);
                formData.append("emails", JSON.stringify([employeeData[5]]));

                // Send the email via API
                await axios.post("http://localhost:3001/api/send-emails", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            message.success("Emails sent successfully!");
            setEmailList([]);
            form.resetFields();
        } catch (error) {
            console.error("Error while sending emails:", error);
            message.error("Failed to send emails. Check the server logs.");
        }
    };




    // const handleSubmit = async () => {
    //     const { subject, matter } = form.getFieldsValue();

    //     if (!subject || !matter || emailList.length === 0) {
    //         message.error("Please fill all fields and upload an email list.");
    //         return;
    //     }

    //     try {
    //         for (let i = 0; i < excelData.length; i++) {
    //             const employeeData = excelData[i];

    //             // Generate PDF for this employee
    //             const pdfBlob = generatePaySlipPDF(employeeData);

    //             const formData = new FormData();
    //             formData.append("subject", subject);
    //             formData.append("matter", matter);
    //             formData.append("senderEmail", user.email);

    //             // Append the generated PDF
    //             formData.append("attachment", pdfBlob, `paySlip_${employeeData[3]}.pdf`); // File named by employee name
    //             formData.append("emails", JSON.stringify([employeeData[5]])); // Employee email

    //             // Send the email with the attached pay slip
    //             await axios.post("http://localhost:3001/api/send-emails", formData, {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //             });
    //         }

    //         message.success("Emails sent successfully!");
    //         setEmailList([]);
    //         form.resetFields();
    //     } catch (error) {
    //         console.error(error);
    //         message.error("Failed to send emails.");
    //     }
    // };



    // Remove uploaded Excel file
    const handleExcelRemove = () => {
        setEmailList([]);
        setFile(null);
    };

    return (
        <div>
            <Card>
                <h2 className="welcome">
                    Welcome, <span className="mail">{user?.email || "Guest"}</span>
                </h2>

                <Form form={form} layout="vertical" style={{ width: '500px', alignItems: 'center' }}>
                    <Form.Item
                        name="subject"
                        label={<span style={{ color: '#386641', fontWeight: 'bold' }}>Subject</span>}
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="matter"
                        label={<span style={{ color: '#386641', fontWeight: 'bold' }}>Description/Body</span>}
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ flex: "1" }}>
                            <Form.Item
                                name="attachment"
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

                        <div style={{ flex: "1" }}>
                            <Form.Item
                                name="uploadExcel"
                                label={<span style={{ color: "#386641", fontWeight: "bold" }}>Upload Mail List</span>}
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


























// import React, { useState } from "react";
// import { Button, Form, Input, Upload, message, Table, Card } from "antd";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import './ProductStyles.css';

// const Product = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const [form] = Form.useForm();
//     const [emailList, setEmailList] = useState([]);
//     const [emailRows, setEmailRows] = useState([]);
//     const [, setFile] = useState(null);

//     const handleFileUpload = (file) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             try {
//                 const data = new Uint8Array(event.target.result);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//                 const headers = jsonData[0];
//                 const emailIndex = headers.findIndex(
//                     (header) => header && header.toLowerCase() === "email"
//                 );

//                 if (emailIndex === -1) {
//                     alert("No 'Email' column found in the uploaded Excel file.");
//                     return;
//                 }

//                 const emails = [];
//                 const rows = [];
//                 jsonData.slice(1).forEach((row) => {
//                     if (row[emailIndex]) {
//                         emails.push(row[emailIndex]);
//                         rows.push(Object.fromEntries(headers.map((h, i) => [h, row[i]])));
//                     }
//                 });

//                 setEmailList(emails);
//                 setEmailRows(rows);
//             } catch (error) {
//                 console.error("Error processing the file:", error);
//                 alert("Failed to process the file. Please ensure it is a valid Excel file.");
//             }
//         };

//         reader.readAsArrayBuffer(file);
//         setFile(file);
//     };

//     const handleSubmit = async () => {
//         const { subject } = form.getFieldsValue();

//         if (!subject || emailList.length === 0 || !user?.email) {
//             message.error("Please fill all fields and upload an email list.");
//             return;
//         }

//         try {
//             await axios.post("http://localhost:3001/api/send-emails", {
//                 subject,
//                 rows: emailRows,
//                 senderEmail: user.email,
//                 senderPassword: 'esnh scug lguh jisc'
//             });
//             message.success("Emails sent successfully!");
//             setEmailList([]);
//             form.resetFields();
//         } catch (error) {
//             console.error(error);
//             message.error("Failed to send emails.");
//         }
//     };

//     return (
//         <div>
//             <Card>
//                 <h2 className="welcome">
//                     Welcome, <span className="mail">{user?.email || "Guest"}</span>
//                 </h2>

//                 <Form form={form} layout="vertical" style={{ width: '500px' }}>
//                     <Form.Item
//                         name="subject"
//                         label="Subject"
//                         rules={[{ required: true }]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.Item label="Upload Excel (Emails)">
//                         <Upload
//                             beforeUpload={(file) => handleFileUpload(file) && false}
//                             showUploadList={false}
//                         >
//                             <Button>Upload Excel File</Button>
//                         </Upload>
//                     </Form.Item>

//                     <Table
//                         dataSource={emailList.map((email, index) => ({ key: index, email }))}
//                         columns={[{ title: "Emails", dataIndex: "email", key: "email" }]}
//                     />
//                     <Button onClick={handleSubmit} className="button-mail">
//                         Send Emails
//                     </Button>
//                 </Form>
//             </Card>
//         </div>
//     );
// };

// export default Product;






