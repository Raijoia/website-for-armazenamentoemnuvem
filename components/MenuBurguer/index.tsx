import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function MenuBurguer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-expanded={isMenuOpen}
      >
        <span className="sr-only">Toggle menu</span>
        {isMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 mt-16">
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Busque Tenant
              </a>
            </li>
            <li>
              <a
                href="/busqueCNPJ"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Busque por CNPJ
              </a>
            </li>
            <li>
              <a
                href="/whois"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Whois
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
      {isMenuOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        // biome-ignore lint/style/useSelfClosingElements: <explanation>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
