import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { route, chapterIds } from "./route";

gsap.registerPlugin(ScrollTrigger);
export function mountMotion(onChapter: (index: number) => void) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const sections = chapterIds.map((id) => document.getElementById(id)!);
  const update = () => {
    const anchors = sections.map((el, i) => (i === 0 ? 0 : el.offsetTop));
    const y = scrollY;
    let p = 4;
    for (let i = 0; i < 4; i++)
      if (y < anchors[i + 1]) {
        p = i + (y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]);
        break;
      }
    route.progress = Math.max(0, Math.min(4, p));
    const chapter = Math.min(4, Math.max(0, Math.floor(p + 0.3)));
    if (route.chapter !== chapter) {
      route.chapter = chapter;
      onChapter(chapter);
    }
    document.documentElement.style.setProperty("--route", String(p / 4));
  };
  const trigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: update,
    onRefresh: update,
  });
  const context = gsap.context(() => {
    if (!reduced.matches)
      gsap.fromTo(
        "[data-hero-enter]",
        { y: 16, opacity: 1 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "all",
        },
      );
  });
  const change = () => {
    context.revert();
    route.paused = reduced.matches;
    dispatchEvent(new Event("desicia-motion"));
  };
  reduced.addEventListener("change", change);
  update();
  return () => {
    trigger.kill();
    context.revert();
    reduced.removeEventListener("change", change);
  };
}
