import { useState } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import company from "../../config/company";

export default function Invoice(){

const [startDate,setStartDate]=useState("");
const [endDate,setEndDate]=useState("");
const [customer,setCustomer]=useState("");
const [data,setData]=useState([]);

const invoiceNumber = "INV-" + Date.now();

/* FETCH DATA */

const fetchInvoice = async () => {
  try{
    const res = await api.get("/reports/transactions", {
      params:{startDate,endDate}
    });
    setData(res.data);
  }catch(err){
    console.error(err);
  }
};

/* GROUP ITEMS */

const groupedItems = Object.values(
  data.reduce((acc, item) => {

    const name = item.product?.name || "Unknown";
    const price = item.product?.price || 0;

    if (!acc[name]) {
      acc[name] = {
        productName: name,
        quantity: 0,
        price,
        total: 0
      };
    }

    acc[name].quantity += item.quantity;
    acc[name].total += item.quantity * price;

    return acc;

  }, {})
);

/* GST */

const total = groupedItems.reduce((sum,i)=>sum+i.total,0);

const GST_RATE = 18;
const gstAmount = (total * GST_RATE) / 100;
const cgst = gstAmount / 2;
const sgst = gstAmount / 2;
const grandTotal = total + gstAmount;

/* SAVE */

const saveInvoice = async () => {

  try{
    const payload = {
      invoiceNumber,
      customerName: customer,
      items: groupedItems,
      totalAmount: grandTotal,
      startDate,
      endDate
    };

    await api.post("/api/invoices", payload);
    alert("Invoice Saved");

  }catch(err){
    alert("Error saving invoice");
  }
};

/* PDF */

const downloadPDF = async () => {

  const element = document.getElementById("invoice");

  const canvas = await html2canvas(element, { scale: 2 });

  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);

  pdf.save(`${invoiceNumber}.pdf`);
};

return(

<div className="p-8 max-w-[1100px] mx-auto space-y-6">

<h1 className="text-2xl font-semibold text-gray-800">
Invoice Generator
</h1>

{/* INPUT */}

<div className="flex gap-4 flex-wrap bg-white p-4 rounded-xl shadow border">

<input
type="text"
placeholder="Customer Name"
value={customer}
onChange={e=>setCustomer(e.target.value)}
className="border p-2 rounded w-52"
/>

<input
type="date"
value={startDate}
onChange={e=>setStartDate(e.target.value)}
className="border p-2 rounded"
/>

<input
type="date"
value={endDate}
onChange={e=>setEndDate(e.target.value)}
className="border p-2 rounded"
/>

<button
onClick={fetchInvoice}
className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
Generate
</button>

</div>

{/* INVOICE */}

<div id="invoice" className="bg-white p-10 rounded-2xl shadow-xl border text-gray-800">

{/* HEADER */}

<div className="flex justify-between border-b pb-6">

<div className="flex gap-4">
<img src={company.logo} className="h-14"/>

<div>
<h2 className="text-2xl font-bold">{company.name}</h2>
<p className="text-sm text-gray-500">{company.tagline}</p>
<p className="text-xs text-gray-500 mt-2">
{company.address}<br/>
GSTIN: {company.gstin}
</p>
</div>
</div>

<div className="text-right">
<h3 className="text-xl font-bold text-indigo-600">TAX INVOICE</h3>
<p><b>Invoice:</b> {invoiceNumber}</p>
<p><b>Date:</b> {new Date().toLocaleDateString()}</p>
</div>

</div>

{/* CUSTOMER */}

<div className="mt-6">
<p className="text-gray-500 text-sm">Bill To:</p>
<h3 className="font-semibold">{customer || "Walk-in Customer"}</h3>
</div>

{/* TABLE */}

<table className="w-full mt-8 border text-sm">

<thead className="bg-gray-100">
<tr>
<th className="p-3">#</th>
<th className="p-3 text-left">Product</th>
<th className="p-3">Qty</th>
<th className="p-3 text-right">Price</th>
<th className="p-3 text-right">Amount</th>
</tr>
</thead>

<tbody>

{groupedItems.map((item, i)=>(

<tr key={i} className="border-t">

<td className="p-3">{i+1}</td>
<td className="p-3">{item.productName}</td>
<td className="p-3 text-center">{item.quantity}</td>
<td className="p-3 text-right">₹{item.price.toLocaleString("en-IN")}</td>
<td className="p-3 text-right font-semibold">₹{item.total.toLocaleString("en-IN")}</td>

</tr>

))}

</tbody>

</table>

{/* TOTAL */}

<div className="flex justify-end mt-8">

<div className="w-80 space-y-2">

<div className="flex justify-between">
<span>Subtotal</span>
<span>₹{total.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between">
<span>CGST (9%)</span>
<span>₹{cgst.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between">
<span>SGST (9%)</span>
<span>₹{sgst.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between border-t pt-2 text-lg font-bold">
<span>Total</span>
<span>₹{grandTotal.toLocaleString("en-IN")}</span>
</div>

</div>

</div>

{/* FOOTER */}

<div className="mt-12 border-t pt-6 text-xs text-gray-500 flex justify-between">

<div>
<p><b>Terms & Conditions</b></p>
<p>No return after sale.</p>
<p>Subject to jurisdiction.</p>
</div>

<div className="text-right">
<p>For {company.name}</p>
<br/>
<p>Authorized Signatory</p>
</div>

</div>

</div>

{/* ACTIONS */}

<div className="flex gap-4">

<button onClick={downloadPDF}
className="bg-green-600 text-white px-4 py-2 rounded">
Download
</button>

<button onClick={saveInvoice}
className="bg-indigo-600 text-white px-4 py-2 rounded">
Save
</button>

<button onClick={()=>window.print()}
className="bg-blue-600 text-white px-4 py-2 rounded">
Print
</button>

</div>

{/* PRINT FIX */}

<style>{`
@media print {
  @page { size: A4; margin: 10mm; }

  body * { visibility: hidden; }

  #invoice, #invoice * { visibility: visible; }

  #invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  button, input { display: none !important; }
}
`}</style>

</div>

);
}