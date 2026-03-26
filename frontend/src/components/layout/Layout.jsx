import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex bg-[#f5f6fa] min-h-screen">

      <Sidebar/>

      <div className="flex-1 p-10">
        {children}
      </div>

    </div>
  );
}