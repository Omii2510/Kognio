import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { PlusCircle, MinusCircle, Package } from "lucide-react";

export default function StockManagement() {

const [products,setProducts]=useState([])
const [selectedProduct,setSelectedProduct]=useState("")
const [quantity,setQuantity]=useState("")
const [reason,setReason]=useState("")

/* NEW PRODUCT STATES */

const [createNew,setCreateNew]=useState(false)
const [newProductName,setNewProductName]=useState("")
const [newPrice,setNewPrice]=useState("")
const [minStock,setMinStock]=useState("10")

useEffect(()=>{
fetchProducts()
},[])

const fetchProducts=async()=>{
try{
const response=await productService.getAll()
setProducts(response.data)
}catch(error){
console.error("Error fetching products:",error)
}
}

/* ADD STOCK */

const handleAddStock=async(e)=>{

e.preventDefault()

try{

let productId = selectedProduct

/* CREATE PRODUCT IF NEW */

if(createNew){

const created=await productService.create({
name:newProductName,
price:Number(newPrice),
quantity:0,
minStockLevel:Number(minStock)
})

productId = created.data._id

}

/* ADD STOCK */

await productService.addStock({
productId,
quantity:Number(quantity),
reason
})

alert("Stock added successfully")

/* RESET FORM */

setQuantity("")
setReason("")
setNewProductName("")
setNewPrice("")
setCreateNew(false)

fetchProducts()

window.dispatchEvent(new Event("inventoryUpdated"))

}catch(error){

alert("Error adding stock")

}

}

/* REMOVE STOCK */

const handleRemoveStock=async(e)=>{

e.preventDefault()

try{

await productService.removeStock({
productId:selectedProduct,
quantity:Number(quantity),
reason
})

alert("Stock removed successfully")

setQuantity("")
setReason("")

fetchProducts()

window.dispatchEvent(new Event("inventoryUpdated"))

}catch(error){

alert(error.response?.data?.message || "Error removing stock")

}

}

return(

<div className="space-y-8">

<h1 className="text-2xl font-semibold text-gray-800">
Stock Management
</h1>

<div className="grid md:grid-cols-2 gap-8">

{/* ADD STOCK */}

<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-sm p-6">

<div className="flex items-center gap-2 mb-6">

<PlusCircle size={20} className="text-blue-600"/>

<h2 className="font-semibold text-gray-700">
Add Stock
</h2>

</div>

<form onSubmit={handleAddStock} className="space-y-4">

{/* PRODUCT MODE SWITCH */}

<div className="flex gap-4 text-sm">

<label className="flex items-center gap-2">

<input
type="radio"
checked={!createNew}
onChange={()=>setCreateNew(false)}
/>

Existing Product

</label>

<label className="flex items-center gap-2">

<input
type="radio"
checked={createNew}
onChange={()=>setCreateNew(true)}
/>

Create New Product

</label>

</div>

{/* EXISTING PRODUCT */}

{!createNew && (

<select
value={selectedProduct}
onChange={(e)=>setSelectedProduct(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
>

<option value="">Select Product</option>

{products.map(p=>(
<option key={p._id} value={p._id}>
{p.name} (Current: {p.quantity})
</option>
))}

</select>

)}

{/* NEW PRODUCT FORM */}

{createNew && (

<div className="space-y-3">

<input
type="text"
placeholder="Product Name"
value={newProductName}
onChange={(e)=>setNewProductName(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
/>

<input
type="number"
placeholder="Product Price"
value={newPrice}
onChange={(e)=>setNewPrice(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
/>

<input
type="number"
placeholder="Min Stock Level"
value={minStock}
onChange={(e)=>setMinStock(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
/>

</div>

)}

<input
type="number"
placeholder="Quantity"
value={quantity}
onChange={(e)=>setQuantity(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
min="1"
/>

<input
type="text"
placeholder="Reason"
value={reason}
onChange={(e)=>setReason(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
/>

<button
type="submit"
className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl"
>

Add Stock

</button>

</form>

</div>

{/* REMOVE STOCK */}

<div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl shadow-sm p-6">

<div className="flex items-center gap-2 mb-6">

<MinusCircle size={20} className="text-red-500"/>

<h2 className="font-semibold text-gray-700">
Remove Stock
</h2>

</div>

<form onSubmit={handleRemoveStock} className="space-y-4">

<select
value={selectedProduct}
onChange={(e)=>setSelectedProduct(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
>

<option value="">Select Product</option>

{products.map(p=>(
<option key={p._id} value={p._id}>
{p.name} (Current: {p.quantity})
</option>
))}

</select>

<input
type="number"
placeholder="Quantity"
value={quantity}
onChange={(e)=>setQuantity(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
min="1"
/>

<input
type="text"
placeholder="Reason"
value={reason}
onChange={(e)=>setReason(e.target.value)}
className="w-full border border-gray-200 rounded-xl px-4 py-2"
required
/>

<button
type="submit"
className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-2 rounded-xl"
>

Remove Stock

</button>

</form>

</div>

</div>

</div>

)

}