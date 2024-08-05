const SeatMapExtension = {
  name: 'SeatMap',
  type: 'response',
  match: ({ trace }) => {
    console.log('Checking trace:', trace);
    return trace.type === 'ext_seatMap';
  },
  render: ({ trace, element }) => {
    console.log('Rendering seat map with data:', trace.payload);
    try {
      const seatMapData = trace.payload.seatMap;
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
                        title={`Seat ${seat.number} - $${seat.price}`}
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
      ReactDOM.render(React.createElement(SeatMapComponent), element);
    } catch (error) {
      console.error('Error rendering seat map:', error);
      element.textContent = 'Error rendering seat map. Please try again.';
    }
  },
};

console.log('SeatMapExtension defined');
