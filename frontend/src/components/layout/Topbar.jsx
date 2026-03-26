export default function Topbar() {

  return (
    <div
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px"
      }}
    >
      <h3 style={{ margin: 0 }}>AI Smart Inventory</h3>

      <input
        placeholder="Search..."
        style={{
          padding: "8px 15px",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}
      />
    </div>
  );
}