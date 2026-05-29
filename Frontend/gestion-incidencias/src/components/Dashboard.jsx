import React from 'react';

const Dashboard = ({ stats }) => {
    const cards = [
        { label: 'Total', value: stats.total, color:'bg-primary'},
        { label: 'Pendientes', value: stats.pendientes, color: 'bg-danger'},
        { label: 'En Proceso', value: stats.enProceso, color: 'bg-warning text-dark'},
        { label: 'Resueltas', value: stats.resueltas, color: 'bg-success'},

    ];

return (
        <div className="row g-3 mb-4">
            {cards.map((card, index) => (
                <div className="col-6 col-md-3" key={index}>
                    <div className={`card ${card.color} text-white shadow-sm border-0`}>
                        <div className="card-body text-center p-2">
                            <h6 className="card-title mb-0" style={{fontSize: '0.8rem'}}>{card.label}</h6>
                            <h3 className="fw-bold mb-0">{card.value}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;