import Countdown from "react-countdown";
import { useGetBookingsByUserQuery } from "../redux/api/bookingApi";
import "./BookingManagement.css";

const BookingManagement = () => {
  const { data: bookings } = useGetBookingsByUserQuery(undefined);
  const userBookings = bookings?.response?.data || [];

  // Custom countdown renderer for displaying remaining time
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCountdownRenderer = (props: any) => {
    const { days, hours, minutes, seconds, completed } = props;
    if (completed) {
      return <span>Time's up!</span>;
    } else {
      return (
        <div className="countdown-timer">
          {days > 0 && <span>{days}d </span>}
          {hours > 0 && <span>{hours}h </span>}
          {minutes > 0 && <span>{minutes}m </span>}
          <span>{seconds}s</span>
        </div>
      );
    }
  };

  const now = new Date().getTime();

  return (
    <div className="booking-management">
      <h2>Upcoming Bookings</h2>
      <div className="booking-cards">
        {userBookings
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((booking: any) => {
            // Ensure booking and slot properties exist before accessing date and time
            if (
              !booking ||
              !booking.slot ||
              !booking.slot.date ||
              !booking.slot.startTime
            )
              return false;

            const bookingDateTime = new Date(
              `${booking.slot.date}T${booking.slot.startTime}`
            ).getTime();
            return bookingDateTime >= now;
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((booking: any) => (
            <div key={booking._id} className="booking-card">
              <h3>Service: {booking?.service?.name || "N/A"}</h3>
              <p>Date: {booking?.slot?.date || "N/A"}</p>
              <p>
                Time: {booking?.slot?.startTime || "N/A"} -{" "}
                {booking?.slot?.endTime || "N/A"}
              </p>
              <Countdown
                date={new Date(
                  `${booking.slot.date}T${booking.slot.startTime}`
                ).getTime()}
                renderer={getCountdownRenderer}
              />
            </div>
          ))}
      </div>

      <h2>Past Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Registration</th>
          </tr>
        </thead>
        <tbody>
          {userBookings
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((booking: any) => {
              // Ensure booking and slot properties exist before accessing date and time
              if (
                !booking ||
                !booking.slot ||
                !booking.slot.date ||
                !booking.slot.startTime
              )
                return false;

              const bookingDateTime = new Date(
                `${booking.slot.date}T${booking.slot.startTime}`
              ).getTime();
              return bookingDateTime < now;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((booking: any) => (
              <tr key={booking._id}>
                <td>{booking?.service?.name || "N/A"}</td>
                <td>{booking?.slot?.date || "N/A"}</td>
                <td>
                  {booking?.slot?.startTime || "N/A"} -{" "}
                  {booking?.slot?.endTime || "N/A"}
                </td>
                <td>
                  {booking?.vehicleBrand || "N/A"}{" "}
                  {booking?.vehicleModel || "N/A"}
                </td>
                <td>{booking?.registrationPlate || "N/A"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingManagement;
