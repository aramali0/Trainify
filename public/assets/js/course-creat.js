import Quill from "quill";
window.Quill = Quill;


new Quill("#snow-editor", {
  theme: "snow",
  modules: {
      toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: [!1, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
    ],
    ["direction", { align: [] }],
    ["link", "image", "video"],
    ["clean"],
],
},
});

// Sortable js

import Sortable from "sortablejs/Sortable";

var example = document.getElementById('nestable')

new Sortable(example, {
    handle: '.handle', // handle class
    animation: 150
});