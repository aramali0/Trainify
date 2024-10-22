import flatpickr from "flatpickr";

import Dropzone from "dropzone";

flatpickr("#datepicker-basic", {
    defaultDate: new Date(),
    dateFormat: "d-m-Y",
});

flatpickr("#join-date", {
    dateFormat: "d-m-Y",
});

flatpickr("#birth-date", {
    defaultDate: "2005-04-12",
    dateFormat: "d-m-Y",
});

flatpickr("#t-birth-date", {
    defaultDate: "1998-04-12",
    dateFormat: "d-m-Y",
});

flatpickr("#invoice-date", {
    defaultDate: "12-03-2023",
    dateFormat: "d-m-Y",
});

flatpickr("#due-date-selected", {
    defaultDate: "12-04-2023",
    dateFormat: "d-m-Y",
});

flatpickr("#joining-date", {
    defaultDate: "2005-04-12",
    dateFormat: "d-m-Y",
});

document.addEventListener("DOMContentLoaded", () => {
    const myDropzone = new Dropzone("#my-dropzone", {
        // Your Dropzone options here
    });
});
