import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 xl:px-36 mt-24 md:mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-14">
        <div className="max-w-96">
          <img src={assets.logo} alt="logo" className="w-36 h-auto" />
          <p className="mt-6 text-sm">
            Lorem Ipsum has been the industry's standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <div className="flex items-center gap-3.5 mt-4">
            <img src={assets.googlePlay} alt="google play" className="h-10 w-auto" />
            <img src={assets.appStore} alt="app store" className="h-10 w-auto" />
          </div>
        </div>

        <div className="flex items-start md:justify-end gap-16 xl:gap-40">
          <div>
            <h2 className="font-semibold mb-5 text-white">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-5 text-white">Get in touch</h2>
            <ul className="text-sm space-y-2">
              <li>+1-234-567-890</li>
              <li>contact@example.com</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-sm text-gray-500">
        Copyright {new Date().getFullYear()} © Tech. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
