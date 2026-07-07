import AboutData from "./AboutData";
import AboutTeam from "./AboutTeam";

export default function AboutSection({ page }: { page: "homepage" | "about" }) {
  return (
    <section className="flex flex-col">
      <div className="bg-black px-[24px] py-[40px]">
        <AboutData page={page} />
      </div>
      <div className="bg-ui-02 px-[24px] py-[40px]">
        <AboutTeam page={page} />
      </div>
    </section>
  );
}
