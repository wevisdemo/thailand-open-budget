import AboutData from "./AboutData";
import AboutTeam from "./AboutTeam";

export default function AboutSection() {
  return (
    <section className="flex flex-col gap-[40px]">
      <AboutData />
      <hr className="border-[--color-ui-03]" />
      <AboutTeam />
    </section>
  );
}
