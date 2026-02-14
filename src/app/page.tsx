import Navbar from "./component/navbar";
import Hero from "./component/hero";
import MainPage from "./component/mainpage";
import Footer from "./component/footer";
import { services, properties } from "../mock";


export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <MainPage services={services} properties={properties} />
      <Footer />
    </>
  );
}
