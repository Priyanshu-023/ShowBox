import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, Search, TicketPlus, XIcon } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/react";
import { useContext, useState } from "react";
import { AppDataContext } from "../context/AppContext";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteMovies } = useContext(AppDataContext);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Theatres", path: "/" },
    { name: "Releases", path: "/" },
    ...(favoriteMovies.length > 0
      ? [{ name: "Favourites", path: "/favorite" }]
      : []),
  ];
  return (
    <div className="fixed top-0 left-0 z-50 flex justify-between items-center w-full px-6 md:px-16 xl:px-36 py-5">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-28 md:w-auto" />
      </Link>

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed inset-0 z-50 flex-col items-center justify-center gap-8 bg-black/80 backdrop-blur text-lg lg:static lg:flex lg:flex-row lg:justify-start lg:gap-0 lg:space-x-7 lg:rounded-4xl lg:bg-gray-800 lg:backdrop-blur-none lg:px-6 lg:py-3 lg:text-base`}
      >
        <XIcon
          className="absolute top-6 right-6 w-6 h-6 cursor-pointer lg:hidden"
          onClick={() => setIsOpen(false)}
        />
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => {
              setIsOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-8 xl:mr-10">
        <Search className="w-6 h-6 cursor-pointer hover:text-gray-300 transition" />
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/myBookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-red-500 hover:bg-red-600 py-2 px-4 md:px-6 rounded-3xl cursor-pointer transition"
          >
            Login
          </button>
        )}
        <MenuIcon
          className="w-8 h-8 cursor-pointer lg:hidden"
          onClick={() => setIsOpen(true)}
        />
      </div>
    </div>
  );
};

export default Navbar;
