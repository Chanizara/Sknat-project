import BeforeFooter from "./component/before_footer";
import Hero from "./component/hero";
import MainPage from "./component/mainpage";
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
      <Hero />
      <MainPage properties={properties} />
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <Contact />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <BeforeFooter />
        </div>
      </div>
    </>
  );
}
