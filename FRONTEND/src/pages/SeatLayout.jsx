import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { AppDataContext } from "../context/AppContext";

const groupRows = [
  ["A", "B"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["I", "J"],
];

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();

  const {axios,getToken,user} = useContext(AppDataContext)

  const [show, setShow] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([])

  const timings = show?.dateTime?.[date] || [];

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) setShow(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getOccupiedSeats = async ()=>{
    try {
      const {data} = await axios.get(`/api/bookings/seats/${selectedTime.showId}`)
      if(data.success){
        setOccupiedSeats(data.occupiedSeats)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getShow()
  }, [id])

  useEffect(()=>{
    if(selectedTime){
       getOccupiedSeats()
    }
  },[selectedTime])

  useEffect(() => {
    setSelectedTime(timings[0] || null);
    setSelectedSeats([]);
  }, [date, show]);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select up to 5 seats");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeatRow = (row) => (
    <div key={row} className="flex gap-1 sm:gap-2 mt-2">
      {Array.from({ length: 9 }, (_, i) => {
        const seatId = `${row}${i + 1}`;
        const isSelected = selectedSeats.includes(seatId);
        const isOccupied = occupiedSeats.includes(seatId);
        return (
          <button
            key={seatId}
            disabled={isOccupied}
            onClick={() => handleSeatClick(seatId)}
            className={`h-6 w-6 sm:h-8 sm:w-8 rounded border text-[9px] sm:text-xs transition cursor-pointer ${
              isOccupied
                ? "bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed"
                : isSelected
                ? "bg-primary border-primary text-white"
                : "border-primary/60 text-gray-300 hover:border-primary"
            }`}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  

  return (
    <div className="relative flex flex-col lg:flex-row px-6 md:px-16 2xl:px-40 pt-30 pb-20 min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="0px" right="0px" />

      <div className="w-full lg:w-60 shrink-0 h-max bg-primary/10 border border-primary/20 rounded-lg py-10">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {timings.map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-full cursor-pointer transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">
                {new Date(item.time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center mt-16 lg:mt-0">
        <h1 className="text-2xl font-semibold">Select your seat</h1>

        <img src={assets.screenImage} alt="screen" className="mt-10" />
        <p className="text-gray-400 text-sm mb-10">SCREEN SIDE</p>

        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center">
            {groupRows[0].map((row) => renderSeatRow(row))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-11 gap-y-6 mt-6">
            {groupRows.slice(1).map((group, index) => (
              <div key={index} className="flex flex-col items-center">
                {group.map((row) => renderSeatRow(row))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={async () => {
            if(!user) return toast("Please login to proceed")
            if (!selectedTime) {
              return toast("Please select a time first");
            }
            if (selectedSeats.length === 0) {
              return toast("Please select at least one seat");
            }

            try {
              const { data } = await axios.post(
                "/api/bookings/create",
                { showId: selectedTime.showId, selectedSeats },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
              );

              if (!data.success) {
                return toast.error(data.message);
              }

              window.location.href = data.url
            } catch (error) {
              console.log(error);
              toast.error("Booking failed, please try again");
            }
          }}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Proceed to Checkout
          <ArrowRightIcon className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
