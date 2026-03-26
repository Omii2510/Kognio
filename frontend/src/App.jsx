import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./components/dashboard/Dashboard";
import ProductList from "./components/products/ProductList";
import StockManagement from "./components/stock/StockManagement";
import VoiceInput from "./components/voice/VoiceInput";
import ChatInterface from "./components/voice/ChatInterface";
import Reports from "./components/reports/Reports";
import ReportGenerator from "./components/reports/ReportGenerator";
import Invoice from "./components/invoice/Invoice";
import InvoiceList from "./components/invoice/InvoiceList";


function App(){

return(

<BrowserRouter>

<Layout>

<Routes>

<Route path="/" element={<Navigate to="/dashboard"/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/products" element={<ProductList/>}/>

<Route path="/stock" element={<StockManagement/>}/>

<Route path="/voice" element={<VoiceInput/>}/>

<Route path="/chat" element={<ChatInterface/>}/>

<Route path="/reports" element={<Reports/>}/>

<Route path="/report-generator" element={<ReportGenerator/>}/>

<Route path="/invoice" element={<Invoice/>}/>

<Route path="/invoices" element={<InvoiceList/>}/>

</Routes>

</Layout>

</BrowserRouter>

)

}

export default App