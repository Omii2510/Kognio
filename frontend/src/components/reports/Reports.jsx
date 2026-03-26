import { useState, useEffect } from "react";
import api from "../../services/api";

import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement
} from "chart.js";

import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement
);

export default function Reports(){

const [transactions,setTransactions]=useState([])
const [alerts,setAlerts]=useState([])
const [analytics,setAnalytics]=useState(null)
const [advanced,setAdvanced]=useState(null)
const [products,setProducts]=useState([])

useEffect(()=>{
fetchData()
},[])

const fetchData=async()=>{

try{

const [transRes,alertRes,analyticsRes,advancedRes,productRes]=
await Promise.all([
api.get("/reports/transactions"),
api.get("/reports/alerts"),
api.get("/reports/analytics"),
api.get("/reports/advanced-analytics"),
api.get("/products")
])

setTransactions(transRes.data)
setAlerts(alertRes.data)
setAnalytics(analyticsRes.data)
setAdvanced(advancedRes.data)
setProducts(productRes.data)

}catch(err){
console.error(err)
}

}

const dismissAlert=async(id)=>{
await api.put(`/reports/alerts/${id}/dismiss`)
fetchData()
}

/* --------------------
CHART DATA
-------------------- */

const topProducts=products.slice(0,6)

const movementChart={
labels:transactions.slice(0,10).map(t=>
new Date(t.createdAt).toLocaleDateString()
),

datasets:[
{
label:"Stock Added",
data:transactions.slice(0,10).map(t=>t.type==="add"?t.quantity:0),
borderColor:"#6366f1",
backgroundColor:"rgba(99,102,241,0.2)",
tension:0.4,
fill:true
},
{
label:"Stock Removed",
data:transactions.slice(0,10).map(t=>t.type==="remove"?t.quantity:0),
borderColor:"#ef4444",
backgroundColor:"rgba(239,68,68,0.2)",
tension:0.4,
fill:true
}
]
}

const distributionChart={
labels:topProducts.map(p=>p.name),
datasets:[{
data:topProducts.map(p=>p.quantity),
backgroundColor:[
"#6366f1",
"#818cf8",
"#a5b4fc",
"#c7d2fe",
"#4f46e5",
"#4338ca"
]
}]
}

const valueChart={
labels:products.slice(0,8).map(p=>p.name),

datasets:[{
label:"Inventory Value",
data:products.slice(0,8).map(p=>p.price*p.quantity),
backgroundColor:"#6366f1",
borderRadius:8,
barThickness:30
}]
}

const chartOptions={
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{position:"bottom"}
}
}

return(

<div className="p-8 max-w-[1400px] mx-auto space-y-8 bg-[#f5f6fa]">

<h1 className="text-2xl font-semibold text-gray-800">
Reports & Analytics
</h1>

{/* KPI CARDS */}

{analytics &&(

<div className="grid md:grid-cols-4 gap-6">

<div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
<p className="text-sm opacity-80">Total Products</p>
<h2 className="text-3xl font-bold">
{analytics.totalProducts}
</h2>
</div>

<div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
<p className="text-sm text-gray-500">Inventory Value</p>
<h2 className="text-2xl font-bold text-indigo-600">
₹{analytics.totalValue.toLocaleString("en-IN")}
</h2>
</div>

<div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
<p className="text-sm text-gray-500">Low Stock</p>
<h2 className="text-2xl font-bold text-orange-500">
{analytics.lowStock}
</h2>
</div>

<div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
<p className="text-sm text-gray-500">Dead Stock</p>
<h2 className="text-2xl font-bold text-red-500">
{analytics.deadStock}
</h2>
</div>

</div>

)}

{/* MAIN CHART + CIRCULAR ANALYTICS */}

<div className="grid md:grid-cols-3 gap-6">

<div className="md:col-span-2 bg-white rounded-2xl shadow-sm border p-6">

<h3 className="font-semibold mb-4">
Stock Movement Trend
</h3>

<div className="h-[300px]">
<Line data={movementChart} options={chartOptions}/>
</div>

</div>


<div className="bg-white rounded-2xl shadow-sm border p-6 text-center">

<h3 className="font-semibold mb-4">
Inventory Health
</h3>

<div className="h-[220px]">

<Doughnut
data={{
labels:["Healthy","Risk"],
datasets:[{
data:[
advanced?.healthScore || 0,
100-(advanced?.healthScore || 0)
],
backgroundColor:[
"#6366f1",
"#e5e7eb"
],
borderWidth:0
}]
}}

options={{
cutout:"70%",
plugins:{legend:{display:false}}
}}
/>

</div>

<div className="text-3xl font-bold text-indigo-600">
{advanced?.healthScore}/100
</div>

<p className="text-sm text-gray-500">
AI inventory health score
</p>

</div>

</div>

{/* BAR CHART */}

<div className="bg-white rounded-2xl shadow-sm border p-6">

<h3 className="font-semibold mb-4">
Inventory Value by Product
</h3>

<div className="h-[320px]">
<Bar data={valueChart} options={chartOptions}/>
</div>

</div>

{/* ALERTS */}

<div>

<h2 className="text-xl font-semibold mb-4">
Active Alerts
</h2>

{alerts.length===0 ?(

<p className="text-gray-500">
No active alerts
</p>

):(alerts.map(alert=>(
<div
key={alert._id}
className="bg-red-50 border border-red-200 p-4 rounded-xl flex justify-between items-center mb-3"
>

<div>

<strong className="text-red-600">
{alert.product?.name}
</strong>

<p className="text-sm text-gray-600">
{alert.message}
</p>

</div>

<button
onClick={()=>dismissAlert(alert._id)}
className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg"
>

Dismiss

</button>

</div>
)))}

</div>

{/* TRANSACTIONS */}

<div className="bg-white rounded-2xl shadow-sm border p-6">

<h2 className="text-xl font-semibold mb-4">
Transaction History
</h2>

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead className="border-b text-gray-500">
<tr>
<th className="text-left py-2">Date</th>
<th className="text-left py-2">Product</th>
<th className="text-left py-2">Type</th>
<th className="text-left py-2">Qty</th>
<th className="text-left py-2">Previous</th>
<th className="text-left py-2">New</th>
</tr>
</thead>

<tbody>

{transactions.map(t=>(
<tr key={t._id} className="border-b">

<td className="py-2">
{new Date(t.createdAt).toLocaleString()}
</td>

<td className="py-2">
{t.product?.name}
</td>

<td className="py-2 capitalize">
{t.type}
</td>

<td className="py-2">
{t.quantity}
</td>

<td className="py-2">
{t.previousQuantity}
</td>

<td className="py-2">
{t.newQuantity}
</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

</div>

)

}