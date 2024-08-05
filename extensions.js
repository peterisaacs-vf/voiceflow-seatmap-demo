import React from 'react';
import ReactDOM from 'react-dom';

export const SeatMapExtension = {
  name: 'SeatMap',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_seatMap' || trace.payload.name === 'ext_seatMap',
  render: ({ trace, element }) => {
    const seatMapData = JSON.parse(trace.payload.seatMap);

    const SeatMapComponent = () => {
      const [selectedSeat, setSelectedSeat] = React.useState(null);

      const handleSeatClick = (seatNumber) => {
        setSelectedSeat(seatNumber);
      };

      const handleConfirm = () => {
        if (selectedSeat) {
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: { selectedSeat },
          });
        }
      };

      return (
        <div className="seat-map">
          <h3>Select a seat for flight {seatMapData.flightNumber}</h3>
          {Object.entries(seatMapData.seatMap).map(([className, rows]) => (
            <div key={className} className="seat-class">
              <h4>{className}</h4>
              {rows.map((row) => (
                <div key={row.row} className="seat-row">
                  {row.seats.map((seat) => (
                    <button
                      key={seat.number}
                      className={`seat ${seat.type} ${
                        seat.available ? 'available' : 'unavailable'
                      } ${selectedSeat === seat.number ? 'selected' : ''}`}
                      onClick={() => seat.available && handleSeatClick(seat.number)}
                      disabled={!seat.available}
                      title={`Seat ${seat.number} - ${seat.price > 0 ? `$${seat.price}` : 'Free'}`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={!selectedSeat}
          >
            Confirm Seat
          </button>
        </div>
      );
    };

    const root = document.createElement('div');
    element.appendChild(root);
    ReactDOM.createRoot(root).render(<SeatMapComponent />);
  },
};
