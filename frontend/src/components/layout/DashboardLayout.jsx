import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7fb" }}>
      
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <Topbar />

        <div style={{ padding: "30px", flex: 1 }}>
          {children}
        </div>

      </div>

    </div>
  );
}