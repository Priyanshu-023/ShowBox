import BlurCircle from "../components/BlurCircle";
import MyBookingCard from "../components/MyBookingCard";
import { useContext, useEffect, useState } from "react";
import { AppDataContext } from "../context/AppContext";

const MyBookings = () => {

  const [booking, setBooking] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  const {axios, getToken, user } = useContext(AppDataContext)


  const getBooking =  async()=>{
    try {
       const {data} = await axios.get('/api/user/bookings',{
      headers : {Authorization:`Bearer ${await getToken()}`}
    })
    if(data.success){
      setBooking(data.bookings)
    }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    if(user){
      getBooking()
    } else {
      setIsLoading(false)
    }
  },[user])


  return (
    <div className="relative px-6 md:px-16 xl:px-36 pt-30 pb-20 min-h-[80vh]">
      <BlurCircle top="100px" left="0px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-8">My Bookings</h1>

      {isLoading ? (
        <p className="text-gray-400">Loading bookings...</p>
      ) : booking.length === 0 ? (
        <p className="text-gray-400">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {booking.map((item, index) => (
            <MyBookingCard key={index} booking={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
