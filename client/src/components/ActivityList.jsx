import React from "react";

function ActivityList({ activities }) {
  if (!activities || activities.length === 0)
    return <div className="activity-card">No Recent Activities</div>;

  return (
    <div className="activity-card">
      <h4>Recent Activities</h4>
      {activities.map((a, i) => (
        <div key={i} className={`activity ${a.status}`}>
          <strong>{a.student_name}</strong> - {a.status} <span>{a.timestamp}</span>
        </div>
      ))}
     
    </div>
  );
}



export default ActivityList;
