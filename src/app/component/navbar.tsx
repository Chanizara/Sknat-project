import Link from "next/link";

export default function Navbar() {
  return (
    <nav
  className="
    absolute top-10 left-0
    w-full
    px-20
    z-50
    flex justify-between items-center
    text-white text-sm tracking-wide
  "
  >
      {/* LEFT : Logo */}
      <img
      src="/house_logo.png"
      alt="logo"
      className="
        h-10
        w-11
        opacity-60
        
      "
    />

     {/* RIGHT : Menu */}
        <div className="col-start-3 justify-self-end flex gap-8 opacity-80">

        <Link
            href="#about"
            className="hover:opacity-100 transition cursor-pointer"
        >
            About
        </Link>

        <Link
            href="#services"
            className="hover:opacity-100 transition cursor-pointer"
        >
            Services
        </Link>

        <Link
            href="#properties"
            className="hover:opacity-100 transition cursor-pointer"
        >
            Properties
        </Link>

        <Link
          href="#contact"
            className="hover:opacity-100 transition cursor-pointer"
        >
            Contact Us
        </Link>

        <Link
          href="/admin/properties"
          className="hover:opacity-100 transition cursor-pointer"
        >
          Admin
        </Link>

        </div>

    </nav>
  );
}
