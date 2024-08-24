import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="mb-10 bg-gradient-to-r from-green-700 to-blue-800 py-6">
      <h1 className="md:text-6xl text-4xl lg:text-7xl font-bold text-center relative z-50 text-white pt-10">
        <Link
          to="/"
          className="hover:text-green-300 transition-colors duration-300"
        >
          Budget<span className="text-green-400">Master</span>
        </Link>
      </h1>
      <p className="text-center text-green-200 mt-2 text-xl">
        Track, Analyze, Grow
      </p>
      <div className="relative mt-6 w-3/4 mx-auto hidden md:block">
        {/* Decorative elements */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-green-400 via-blue-500 to-green-400 h-[2px] w-full blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-green-400 via-blue-500 to-green-400 h-px w-full" />
        <div className="absolute inset-x-40 bottom-0 bg-gradient-to-r from-blue-400 via-green-500 to-blue-400 h-[2px] w-2/3 blur-sm" />
        <div className="absolute inset-x-40 bottom-0 bg-gradient-to-r from-blue-400 via-green-500 to-blue-400 h-px w-2/3" />
      </div>
    </div>
  );
};

export default Header;
