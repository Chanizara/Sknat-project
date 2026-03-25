import BeforeFooter from "./component/before_footer";
import Hero from "./component/hero";
import MainPage from "./component/mainpage";
import Navbar from "./component/navbar";
import Contact from "./component/contact";

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
      <Contact />
      <BeforeFooter />
    </>
  );
}
