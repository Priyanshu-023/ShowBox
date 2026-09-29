import { useContext, useEffect, useState } from "react";
import { CircleDollarSign, PlayCircleIcon, StarIcon, UsersIcon } from "lucide-react";
import { assets } from "../../assets/assets";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";
import { AppDataContext } from "../../context/AppContext";
import toast from "react-hot-toast";

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

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const {axios, getToken, user, imageBaseUrl} = useContext(AppDataContext);

  const fetchDashboardData = async()=>{
    try {
      const {data} = await axios.get('/api/admin/dashboard' ,
        {headers : {Authorization : `Bearer ${await getToken()}`}}
      )
      if(data.success){
        setDashboardData(data.dashboardData)
        setIsLoading(false);
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error Fetching dashboard data", error)
    }
  }

  useEffect(() => {
   if(user){
    fetchDashboardData();
   }
  }, [user]);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: assets.chartIcon,
    },
    {
      title: "Total Revenue",
      value: `$ ${dashboardData.totalRevenue}`,
      icon: CircleDollarSign,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser,
      icon: UsersIcon,
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="relative">
      <BlurCircle top="-100px" left="0px" />
      <BlurCircle bottom="0px" right="0px" />

      <h1 className="text-lg font-medium">
        Admin <span className="text-primary underline">Dashboard</span>
      </h1>

      <div className="flex flex-wrap gap-4 mt-6">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-md px-6 py-4 w-full sm:w-auto sm:min-w-52"
          >
            <div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-xl font-semibold mt-1">{card.value}</p>
            </div>
            {typeof card.icon === "string" ? (
              <img src={card.icon} alt="" className="w-6 h-6" />
            ) : (
              <card.icon className="w-6 h-6 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      <p className="mt-10 text-lg font-medium">Active Shows</p>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mt-4">
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-full sm:w-52 bg-primary/10 border border-primary/20 rounded-lg overflow-hidden hover:-translate-y-1 transition duration-300"
          >
            <img
              src={`${imageBaseUrl}${show.movie.poster_path}`}
              alt={show.movie.title}
              className="h-60 w-full object-cover object-top"
            />
            <div className="p-3">
              <p className="font-medium truncate">{show.movie.title}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-medium">
                  $ {show.showPrice}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-400">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.movie.vote_average.toFixed(1)}
                </p>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {dateFormat(show.showDateTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
