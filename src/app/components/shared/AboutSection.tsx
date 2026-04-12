import AboutData from "./AboutData";
import AboutTeam from "./AboutTeam";

export default function AboutSection() {
  return (
    <section className="flex flex-col">
      <div className="bg-black px-[16px] py-[40px]">
        <AboutData />
      </div>
      <div className="px-[16px] py-[40px]">
        <AboutTeam />
      </div>
    </section>
  );
}
