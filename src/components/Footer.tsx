import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">RentCars</h3>
            <p className="text-sm mb-4">
              Your premier destination for car rentals. We offer a wide range of vehicles to suit your needs, ensuring a smooth and enjoyable journey.
            </p>
            <p className="text-sm">&copy; {new Date().getFullYear()} RentCars. All rights reserved.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="/about" className="hover:text-white transition-colors duration-300">About Us</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="hover:text-white transition-colors duration-300">Contact</a>
              </li>
              <li className="mb-2">
                <Link href="/cars" className="hover:text-white transition-colors duration-300">Our Cars</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Legal</h3>
            <ul>
              <li className="mb-2">
                <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="/terms-and-conditions" className="hover:text-white transition-colors duration-300">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.92.333 4.145.645 3.369.958 2.671 1.45 2.06 2.06 1.45 2.67 0.958 3.369 0.645 4.145.333 4.92.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.278.261 2.123.574 2.909.313.778.805 1.475 1.416 2.085.61.61 1.307 1.103 2.085 1.416.786.313 1.63.514 2.909.574 1.28.058 1.67.072 4.947.072s3.667-.014 4.947-.072c1.278-.06 2.123-.261 2.909-.574.778-.313 1.475-.805 2.085-1.416.61-.61 1.103-1.307 1.416-2.085.313-.786.514-1.63.574-2.909.058-1.28.072-1.67.072-4.947s-.014-3.667-.072-4.947c-.06-1.278-.261-2.123-.574-2.909-.313-.778-.805-1.475-1.416-2.085-.61-.61-1.307-1.103-2.085-1.416C21.083.333 20.238.131 18.957.072 17.677.014 17.26 0 12 0zm0 2.16c3.2 0 3.585.016 4.859.076 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.899.422.422.682.82.899 1.382.166.422.36 1.057.415 2.227.06 1.274.076 1.66.076 4.859s-.016 3.585-.076 4.859c-.055 1.17-.249 1.805-.415 2.227-.217.562-.477.96-.899 1.382-.422.422-.82.682-1.382.899-.422.166-1.057.36-2.227.415-1.274.06-1.66.076-4.859.076s-3.585-.016-4.859-.076c-1.17-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.899-.422-.422-.682-.82-.899-1.382-.166-.422-.36-1.057-.415-2.227-.06-1.274-.076-1.66-.076-4.859s.016-3.585.076-4.859c.055-1.17.249-1.805.415-2.227.217-.562.477-.96.899-1.382.422-.422.82.682 1.382.899.422-.166 1.057-.36 2.227-.415C8.415 2.176 8.8 2.16 12 2.16zM12 6a6 6 0 100 12 6 6 0 000-12zm0 1.92a4.08 4.08 0 110 8.16 4.08 4.08 0 010-8.16zm0 1.224a2.856 2.856 0 100 5.712 2.856 2.856 0 000-5.712zM18.4 5.88a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}