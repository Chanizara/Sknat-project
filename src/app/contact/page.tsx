import { redirect } from "next/navigation";

export default function ContactPage() {
  redirect("/about#about-contact");
}
