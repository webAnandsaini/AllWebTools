import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      className={`md:hidden bg-white border-t border-gray-200 pt-2 pb-4 px-4 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <nav className="flex flex-col space-y-3">
        <Link href="/" className="text-gray-700 hover:text-primary font-medium py-2" onClick={onClose}>
          Home
        </Link>
        <Link
          href="/#popular-tools"
          className="text-gray-700 hover:text-primary font-medium py-2"
          onClick={onClose}
        >
          Popular Tools
        </Link>
        <Link
          href="/categories"
          className="text-gray-700 hover:text-primary font-medium py-2"
          onClick={onClose}
        >
          All Categories
        </Link>
        <Link
          href="#"
          className="bg-primary text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600 transition text-center mt-2"
          onClick={onClose}
        >
          Sign In
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
