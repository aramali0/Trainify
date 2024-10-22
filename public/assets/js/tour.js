import Shepherd from "shepherd.js";

var tour = new Shepherd.Tour({
  defaultStepOptions: {
    cancelIcon: { enabled: !0 },
    classes: "shadow rounded-lg bg-white dark:bg-default-50 h-fit",
    scrollTo: { behavior: "smooth", block: "center" },
  },
  useModalOverlay: { enabled: !0 },
});
document.querySelector("#logo-tour") &&
  tour.addStep({
    title: "Logo Here",
    text: "You can find here status of user who's currently online.",
    attachTo: { element: "#logo-tour", on: "bottom" },
    buttons: [{ text: "Next", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-emerald-600 hover:!bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded", action: tour.next }],
  }),
  document.querySelector("#tour-card-one") &&
    tour.addStep({
      title: "Card One",
      text: "You can find here status of user who's currently online",
      attachTo: { element: "#tour-card-one", on: "bottom" },
      buttons: [
        { text: "Back", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-default-200 hover:!bg-default-300 border-default-100 hover:border-default-200 !text-default-900 rounded", action: tour.back },
        { text: "Next", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-emerald-600 hover:!bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded", action: tour.next },
      ],
    }),
  document.querySelector("#tour-card-two") &&
    tour.addStep({
      title: "Card Two",
      text: "You can find here status of user who's currently online",
      attachTo: { element: "#tour-card-two", on: "bottom" },
      buttons: [
        { text: "Back", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-default-200 hover:!bg-default-300 border-default-100 hover:border-default-200 !text-default-900 rounded", action: tour.back },
        { text: "Next", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-emerald-600 hover:!bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded", action: tour.next },
      ],
    }),
  document.querySelector("#tour-card-three") &&
    tour.addStep({
      title: "Card Three",
      text: "You can find here status of user who's currently online",
      attachTo: { element: "#tour-card-three", on: "bottom" },
      buttons: [
        { text: "Back", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-default-200 hover:!bg-default-300 border-default-100 hover:border-default-200 !text-default-900 rounded", action: tour.back },
        { text: "Next", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-emerald-600 hover:!bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded", action: tour.next },
      ],
    }),
  document.querySelector("#tour-card-four") &&
    tour.addStep({
      title: "Card Four",
      text: "You can find here status of user who's currently online",
      attachTo: { element: "#tour-card-four", on: "bottom" },
      buttons: [
        { text: "Back", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-default-200 hover:!bg-default-300 border-default-100 hover:border-default-200 !text-default-900 rounded", action: tour.back },
        { text: "Next", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-emerald-600 hover:!bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded", action: tour.next },
      ],
    }),
  document.querySelector("#thankyou-tour") &&
    tour.addStep({
      title: "Thank you !",
      text: "Here you can change theme skins and other features.",
      attachTo: { element: "#thankyou-tour", on: "bottom" },
      buttons: [
        { text: "Back", classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-default-200 hover:!bg-default-300 border-default-100 hover:border-default-200 !text-default-900 rounded", action: tour.back },
        {
          text: "Thank you !",
          classes: "py-2 px-5 inline-block font-medium tracking-wide border align-middle duration-500 text-sm text-center bg-primary hover:!bg-primary-600 border-primary hover:border-primary-600 text-white rounded",
          action: tour.complete,
        },
      ],
    }),
  tour.start();
