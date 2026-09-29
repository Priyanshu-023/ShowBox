import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";
import { AppDataContext } from "../../context/AppContext";

const dateFormat = (dateString) => {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString("en-CA");
  const timePart = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
  return `${datePart} ${timePart}`;
};

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {user, axios, getToken} = useContext(AppDataContext);

  const getAllBookings = async()=>{
    try {
      const {data} = await axios.get('/api/admin/all-bookings',
        {headers : {Authorization : `Bearer ${await getToken()}`}}
      );
      if(data.success){
        setBookings(data.bookings);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if(user){
      getAllBookings();
    }
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="relative">
      <BlurCircle top="-100px" left="0px" />
      <BlurCircle top="100px" right="0px" />

      <h1 className="text-lg font-medium">
        List <span className="text-primary underline">Bookings</span>
      </h1>

      <div className="mt-6 max-w-4xl overflow-x-auto rounded-md border border-primary/20">
        <table className="w-full min-w-150 border-collapse text-sm">
          <thead>
            <tr className="bg-primary/20 text-left">
              <th className="p-3 font-medium">User Name</th>
              <th className="p-3 font-medium">Movie Name</th>
              <th className="p-3 font-medium">Show Time</th>
              <th className="p-3 font-medium">Seats</th>
              <th className="p-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-t border-primary/10 bg-primary/5"
              >
                <td className="p-3 min-w-45 pr-4">{booking.user.name}</td>
                <td className="p-3">{booking.show.movie.title}</td>
                <td className="p-3">{dateFormat(booking.show.showDateTime)}</td>
                <td className="p-3">{booking.bookedSeats.join(", ")}</td>
                <td className="p-3">$ {booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBookings;
