import BeforeFooter from "./component/before_footer";
import Hero from "./component/hero";
import MainPage from "./component/mainpage";
import Contact from "./component/contact";
import RegisterSection from "./component/RegisterSection";

import { listProperties } from "@/lib/property-store";
import { type Property } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function Page() {
  let properties: Property[] = [];
  try {
    properties = await listProperties({ excludeSold: true });
  } catch (error) {
    console.error("Cannot load properties from MySQL:", error);
  }

  return (
    <>
      <Hero />
      <MainPage properties={properties} />
      <RegisterSection />
      <Contact />
      <BeforeFooter />
    </>
  );
}
