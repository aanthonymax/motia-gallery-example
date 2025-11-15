import "./index.scss";
import type { HMPLInstanceContext } from "hmpl-js";
import GalleryTemplate from "./components/Gallery/Gallery.hmpl";
import TitleTemplate from "./components/Title/Title.hmpl";

const { response: Title } = TitleTemplate();

const { response: Gallery } = GalleryTemplate(
  (context: HMPLInstanceContext) => {
    const event = context.request.event;
    return {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: event
          ? Number((event.target as HTMLElement).getAttribute("data-page"))
          : 1,
      }),
    };
  }
);

if (Title) {
  document.body.append(Title);
}
if (Gallery) {
  document.body.append(Gallery);
}

const gallery = document.querySelector("#gallery") as HTMLElement;
const galleryInitial = document.querySelector(
  "#gallery-initial"
) as HTMLElement;
const modal = document.querySelector("#modal") as HTMLElement;
const modalImg = modal.querySelector("img") as HTMLImageElement;
const navigationButtons = document.querySelectorAll(
  ".navigation-button"
) as NodeListOf<HTMLElement>;

const setActive = (e: Event): void => {
  const target = e.target as HTMLElement;
  if (target.tagName === "IMG") {
    modalImg.src = (target as HTMLImageElement).src;
    modal.classList.add("active");
  }
};

modal.addEventListener("click", () => {
  modal.classList.remove("active");
});

galleryInitial.addEventListener("click", (e: Event) => {
  setActive(e);
});

gallery.addEventListener("click", (e: Event) => {
  setActive(e);
});

for (let i = 0; i < navigationButtons.length; i++) {
  const btn = navigationButtons[i];
  btn.addEventListener("click", () => {
    if (!galleryInitial.classList.contains("hidden"))
      galleryInitial.classList.add("hidden");
    btn.setAttribute("disabled", "");
    navigationButtons[i === 0 ? 1 : 0].removeAttribute("disabled");
  });
}
