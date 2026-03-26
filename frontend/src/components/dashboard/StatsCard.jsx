export default function StatsCard({ title, value, color = "#6366F1", icon }) {

  const gradient = {
    "#007bff": "linear-gradient(135deg,#667eea,#764ba2)",
    "#ffc107": "linear-gradient(135deg,#f6d365,#fda085)",
    "#28a745": "linear-gradient(135deg,#43e97b,#38f9d7)",
    "#6366F1": "linear-gradient(135deg,#6366F1,#8B5CF6)"
  };

  return (
    <div
      style={{
        background: gradient[color] || gradient["#6366F1"],
        borderRadius: "18px",
        padding: "26px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e)=>{
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 35px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e)=>{
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
      }}
    >

      {/* Background Icon */}
      <div
        style={{
          position: "absolute",
          right: "-10px",
          top: "-10px",
          fontSize: "90px",
          opacity: 0.15
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        <div
          style={{
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            opacity: 0.9,
            marginBottom: "8px"
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "38px",
            fontWeight: "700",
            marginBottom: "6px"
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontSize: "12px",
            opacity: 0.8
          }}
        >
          Updated just now
        </div>

      </div>

    </div>
  );
}