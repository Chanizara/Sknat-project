import Footer from "./component/footer";
import Hero from "./component/hero";
import MainPage from "./component/mainpage";
import Navbar from "./component/navbar";

import { listProperties } from "@/lib/property-store";
import { type Property } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function Page() {
  let properties: Property[] = [];
  try {
    properties = await listProperties();
  } catch (error) {
    console.error("Cannot load properties from MySQL:", error);
  }

  return (
    <>
      <Navbar />
      <Hero />
      <MainPage properties={properties} />
      <Footer />
    </>
  );
}
