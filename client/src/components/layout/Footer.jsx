const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447c0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.807.875 1.297 2.026 1.297 3.323 0 1.297-.49 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297zm7.83-9.404c-.49 0-.875-.385-.875-.875 0-.49.385-.875.875-.875.49 0 .875.385.875.875 0 .49-.385.875-.875.875zm-4.262 9.404c-2.448 0-4.427-1.979-4.427-4.427 0-2.448 1.979-4.427 4.427-4.427 2.448 0 4.427 1.979 4.427 4.427 0 2.448-1.979 4.427-4.427 4.427z" />
      </svg>
    ),
  };

  const contactIcons = {
    email: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    phone: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    location: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  };

  return (
    <footer className="bg-gradient-to-b from-white via-green-50 to-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Information */}
          <div className="space-y-5">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-xl font-semibold text-gray-900">
                  TradeWise
                </span>
              </a>
            </div>

            <p className="text-black text-sm leading-relaxed">
              Ethiopia's first stock trading platform, bridging the gap between
              investors and the emerging capital market.
            </p>

            <div className="flex space-x-4">
              {Object.entries(socialIcons).map(([platform, icon]) => (
                <a
                  key={platform}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-white/50"
                  aria-label={`Follow us on ${platform}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products & Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
              Products
            </h4>
            <ul className="space-y-3">
              {[
                "Stock Trading",
                "Portfolio Management",
                "Digital Wallet",
                "Market Analysis",
                "Educational Resources",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                "Market News",
                "Trading Tutorials",
                "Investment Guides",
                "API Documentation",
                "Webinars",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-gray-600">
                  {contactIcons.email}
                </div>
                <span className="text-sm text-gray-700">
                  support@ethiotrade.com
                </span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-gray-600">
                  {contactIcons.phone}
                </div>
                <span className="text-sm text-gray-700">+251 11 123 4567</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-gray-600">
                  {contactIcons.location}
                </div>
                <span className="text-sm text-gray-700">
                  Bole Road, Addis Ababa, Ethiopia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-600 text-sm">
            © {currentYear} EthioTrade Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Security",
              "Compliance",
              "EthSwitch",
              "Fayda ID",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
