import { ArrowRight, Calendar, Clock } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 xl:px-36 bg-[url('/bg-img-3.jpg')] bg-cover bg-center min-h-screen py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/35 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#09090B] to-transparent" />

      <img
        src={assets.marvelLogo}
        alt="Marvel Studios"
        className="relative z-10 max-h-11 mt-20"
      />

      <h1 className="relative z-10 text-4xl md:text-6xl font-bold leading-[1.05] max-w-2xl">
        The Avengers
      </h1>

      <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <Calendar className="w-4.5 h-4.5" />
          2012
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4.5 h-4.5" />
          2h 23m
        </div>
      </div>

      <p className="relative z-10 max-w-md text-gray-300">
        When an unexpected enemy emerges and threatens global safety and
        security, Nick Fury, director of the international peacekeeping agency
        S.H.I.E.L.D., finds himself in need of a team to pull the world back
        from the brink of disaster. Earth's mightiest heroes must assemble.
      </p>

      <button
        onClick={() => {
          navigate("/movies");
        }}
        className="relative z-10 flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
