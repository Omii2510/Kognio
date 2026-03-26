import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

import {
Package,
AlertTriangle,
TrendingUp,
Activity,
Boxes,
ArrowUp,
ArrowDown
} from "lucide-react";

import { motion } from "framer-motion";

export default function Dashboard(){

const [stats,setStats]=useState(null)
const [products,setProducts]=useState([])
const [loading,setLoading]=useState(true)

const previousActivityRef = useRef([])

useEffect(()=>{

loadData()

// REAL TIME REFRESH EVERY 3 SECONDS
const interval=setInterval(()=>{
loadData()
},3000)

return ()=>clearInterval(interval)

},[])

const loadData=async()=>{

try{

const dashboard=await api.get("/reports/dashboard")
const productRes=await api.get("/products")

setStats(dashboard.data)
setProducts(productRes.data)

previousActivityRef.current = dashboard.data?.recentTransactions || []

}catch(err){

console.error(err)

}

if(loading){
setLoading(false)
}

}

if(loading){
return <div className="p-10 text-gray-500">Loading dashboard...</div>
}

/* ---------------------------
AI INSIGHT ENGINE
----------------------------*/

const fastMoving=[...products]
.sort((a,b)=>b.quantity-a.quantity)
.slice(0,5)

const deadStock=products.filter(p=>p.quantity===0)

const lowStock=products.filter(
p=>p.quantity <= (p.minStock || p.min_stock || 10)
)

const healthScore=Math.max(
0,
100 - (lowStock.length * 10) - (deadStock.length * 20)
)

const alerts=[]

if(lowStock.length>0){
alerts.push(`${lowStock.length} low stock products`)
}

if(deadStock.length>0){
alerts.push(`${deadStock.length} dead stock items`)
}

const recommendations=[]

if(lowStock.length>0){
recommendations.push("Reorder low stock products")
}

if(deadStock.length>0){
recommendations.push("Run discount campaign for dead stock")
}

if(fastMoving.length>0){
recommendations.push("Increase inventory for fast selling items")
}

/* ---------------------------
TIME FORMATTER
----------------------------*/

function timeAgo(date){

if(!date) return "just now"

const seconds=Math.floor((new Date()-new Date(date))/1000)

if(seconds<60) return "just now"

const minutes=Math.floor(seconds/60)

if(minutes<60) return `${minutes} min ago`

const hours=Math.floor(minutes/60)

if(hours<24) return `${hours} hr ago`

const days=Math.floor(hours/24)

return `${days} day ago`

}

return(

<div className="space-y-8">

<h1 className="text-2xl font-semibold text-gray-800">
Dashboard
</h1>

{/* KPI CARDS */}

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg">

<div className="flex justify-between items-center">

<div>
<p className="text-sm opacity-80">
Total Products
</p>

<h2 className="text-3xl font-bold">
{stats?.totalProducts}
</h2>
</div>

<Package size={32} className="opacity-70"/>

</div>

</div>

<div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

<p className="text-sm text-gray-500">
Inventory Value
</p>

<h2 className="text-2xl font-bold text-gray-800">
₹{stats?.stockValue?.toLocaleString("en-IN")}
</h2>

</div>

<div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

<p className="text-sm text-gray-500">
Low Stock Items
</p>

<h2 className="text-2xl font-bold text-red-500">
{lowStock.length}
</h2>

</div>

</div>

{/* SECOND ROW */}

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

<div className="flex justify-between items-center mb-4">

<h3 className="font-semibold text-gray-700">
Inventory Health Score
</h3>

<span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
AI
</span>

</div>

<div className="text-4xl font-bold text-indigo-600 mb-3">
{healthScore}/100
</div>

<div className="w-full h-2 bg-gray-200 rounded-full">

<div
className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
style={{width:`${healthScore}%`}}
/>

</div>

<p className="text-xs text-gray-500 mt-2">
AI calculated inventory performance
</p>

</div>

<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

<h3 className="font-semibold text-gray-700 mb-4">
AI Alerts
</h3>

<div className="space-y-3">

{alerts.length===0 ? (
<div className="text-green-600 text-sm">
✓ Inventory looks healthy
</div>
):(alerts.map((alert,i)=>(
<div key={i} className="flex items-center gap-3 text-sm text-gray-700">
<div className="w-2 h-2 bg-red-500 rounded-full"/>
{alert}
</div>
)))}

</div>

</div>

</div>

{/* FAST MOVING PRODUCTS */}

<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

<h3 className="font-semibold text-gray-700 mb-4">
Fast Moving Products
</h3>

<div className="flex flex-wrap gap-3">

{fastMoving.map((p,i)=>(

<div
key={i}
className="px-4 py-2 rounded-xl bg-gray-50 border text-sm flex gap-2"
>

<span className="font-medium">
{p.name}
</span>

<span className="text-indigo-600">
{p.quantity}
</span>

</div>

))}

</div>

</div>

{/* RECENT ACTIVITY */}

<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

<div className="flex items-center justify-between mb-6">

<h3 className="font-semibold text-gray-700">
Recent Activity
</h3>

<div className="flex items-center gap-2 text-xs text-green-600">

<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>

LIVE Updating

</div>

</div>

<div className="space-y-4">

{stats?.recentTransactions?.map((item,i)=>{

const type = item.type === "remove" ? "remove" : "add"

const productName = item.product?.name || item.productName || "Unknown"

return(

<motion.div
key={item._id || i}
initial={{opacity:0, y:10}}
animate={{opacity:1, y:0}}
transition={{delay:i*0.05}}

className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border hover:shadow-sm transition"
>

<div className="flex items-center gap-4">

<div className={`p-2 rounded-lg ${
type==="add"
? "bg-green-100 text-green-600"
: "bg-red-100 text-red-600"
}`}>

{type==="add"
? <ArrowUp size={16}/>
: <ArrowDown size={16}/>
}

</div>

<div>

<p className="text-sm font-medium text-gray-800">
{productName}
</p>

<p className="text-xs text-gray-500">
Stock updated • {timeAgo(item.createdAt)}
</p>

</div>

</div>

<div className={`text-xs px-3 py-1 rounded-full font-medium
${type==="add"
? "bg-green-100 text-green-700"
: "bg-red-100 text-red-700"}
`}>

{type==="add" ? "+" : "-"} {item.quantity} units

</div>

</motion.div>

)

})}

</div>

</div>

</div>

)

}