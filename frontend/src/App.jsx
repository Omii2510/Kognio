import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

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
<Routes>

<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/forgot-password" element={<ForgotPassword/>}/>
<Route path="/reset-password/:token" element={<ResetPassword/>}/>

<Route path="/" element={<ProtectedRoute><Layout><Navigate to="/dashboard"/></Layout></ProtectedRoute>}/>
<Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>}/>
<Route path="/products" element={<ProtectedRoute><Layout><ProductList/></Layout></ProtectedRoute>}/>
<Route path="/stock" element={<ProtectedRoute><Layout><StockManagement/></Layout></ProtectedRoute>}/>
<Route path="/voice" element={<ProtectedRoute><Layout><VoiceInput/></Layout></ProtectedRoute>}/>
<Route path="/chat" element={<ProtectedRoute><Layout><ChatInterface/></Layout></ProtectedRoute>}/>
<Route path="/reports" element={<ProtectedRoute><Layout><Reports/></Layout></ProtectedRoute>}/>
<Route path="/report-generator" element={<ProtectedRoute><Layout><ReportGenerator/></Layout></ProtectedRoute>}/>
<Route path="/invoice" element={<ProtectedRoute><Layout><Invoice/></Layout></ProtectedRoute>}/>
<Route path="/invoices" element={<ProtectedRoute><Layout><InvoiceList/></Layout></ProtectedRoute>}/>

</Routes>
</BrowserRouter>

)

}

export default App