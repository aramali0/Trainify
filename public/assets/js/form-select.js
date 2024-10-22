import Choices from "choices.js";

document.addEventListener("DOMContentLoaded", function () {
  const genericExamples = document.querySelectorAll("[data-trigger]");
  genericExamples.forEach(function (element) {
    new Choices(element, {
      searchPlaceholderValue: "This is a search placeholder",
    });
  });

  const singleNoSearch = new Choices("#choices-single-no-search", {
    searchEnabled: false,
    removeItemButton: true,
    choices: [
      { value: "One", label: "Label One" },
      { value: "Two", label: "Label Two", disabled: true },
      { value: "Three", label: "Label Three" },
    ],
  }).setChoices(
    [
      { value: "Four", label: "Label Four", disabled: true },
      { value: "Five", label: "Label Five" },
      { value: "Six", label: "Label Six", selected: true },
    ],
    "value",
    "label",
    false
  );

  // const singleNoSorting = new Choices("#choices-single-no-sorting", {
  //   shouldSort: false,
  // });

  const multipleCancelButton = new Choices("#choices-multiple-remove-button", {
    removeItemButton: true,
  });

  const multipleDefault = new Choices(document.getElementById("choices-multiple-groups"));
  const textRemove = new Choices(document.getElementById("choices-text-remove-button"), {
    delimiter: ",",
    editItems: true,
    maxItemCount: 5,
    removeItemButton: true,
  });
  const textUniqueVals = new Choices("#choices-text-unique-values", {
    paste: false,
    duplicateItemsAllowed: false,
    editItems: true,
  });
  const textDisabled = new Choices("#choices-text-disabled", {
    addItems: false,
    removeItems: false,
  }).disable();
});
