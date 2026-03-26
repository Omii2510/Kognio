import { useEffect,useState } from "react";
import api from "../../services/api";

export default function InvoiceList(){

const [list,setList]=useState([])

useEffect(()=>{
api.get("/invoices").then(res=>setList(res.data))
},[])

return(

<div className="p-8">

<h1 className="text-xl font-semibold mb-4">
Invoices
</h1>

<table className="w-full">

<thead>
<tr>
<th>Invoice</th>
<th>Customer</th>
<th>Total</th>
</tr>
</thead>

<tbody>

{list.map(i=>(
<tr key={i._id}>
<td>{i.invoiceNumber}</td>
<td>{i.customerName}</td>
<td>₹{i.totalAmount}</td>
</tr>
))}

</tbody>

</table>

</div>

)
}