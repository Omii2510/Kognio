export default function RecentActivity({ transactions }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Recent Activities</h3>
      {transactions?.length === 0 ? (
        <p>No recent activities</p>
      ) : (
        <div style={{ marginTop: '15px' }}>
          {transactions?.map((t) => (
            <div key={t._id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{t.product?.name}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                  {t.type === 'add' ? '➕' : '➖'} {t.quantity} units
                </p>
              </div>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {new Date(t.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
