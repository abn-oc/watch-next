export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center sm:min-h-[60vh] min-h-[52vh] justify-center px-4">
      {/* Logo and Icon */}
      <div className="flex gap-4 justify-center items-center">
        <div className="relative">
          {/* insert logo here if u make 1 */}
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
          Watch Next
        </h1>
      </div>

      {/* Main Heading */}
      <div className="text-center max-w-4xl">
        <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Never forget what to
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {" "}watch next
          </span>
        </h2>
        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Keep track of movies, TV shows and all your favorite media in one organized watchlist.
        </p>
      </div>

      {/* Decorative Gradient Line */}
      {/* <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" /> */}
    </div>
  );
}