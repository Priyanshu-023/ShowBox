import { useContext, useEffect, useState } from "react";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";
import { AppDataContext } from "../../context/AppContext";

const dateFormat = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {axios,getToken,user} = useContext(AppDataContext);

  const getAllShows = async ()=>{
    try {
      const {data} = await axios.get('/api/admin/all-shows',
        {headers : {Authorization : `Bearer ${await getToken()}`}
      })
      if(data.success){
        setShows(data.shows);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(user){
      getAllShows()
    }
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="relative">
      <BlurCircle top="-100px" left="0px" />
      <BlurCircle top="100px" right="0px" />

      <h1 className="text-lg font-medium">
        List <span className="text-primary underline">Shows</span>
      </h1>

      <div className="mt-6 max-w-4xl overflow-x-auto rounded-md border border-primary/20">
        <table className="w-full min-w-150 border-collapse text-sm">
          <thead>
            <tr className="bg-primary/20 text-left">
              <th className="p-3 font-medium">Movie Name</th>
              <th className="p-3 font-medium">Show Time</th>
              <th className="p-3 font-medium">Total Bookings</th>
              <th className="p-3 font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => {
              const totalBookings = Object.keys(show.occupiedSeats).length;
              const earnings = totalBookings * show.showPrice;
              return (
                <tr
                  key={show._id}
                  className="border-t border-primary/10 bg-primary/5"
                >
                  <td className="p-3 min-w-45 pr-4">{show.movie.title}</td>
                  <td className="p-3">{dateFormat(show.showDateTime)}</td>
                  <td className="p-3">{totalBookings}</td>
                  <td className="p-3">$ {earnings}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListShows;
