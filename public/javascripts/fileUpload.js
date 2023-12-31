const rootStyles = window.getComputedStyle(document.documentElement);

if (
  rootStyles.getPropertyValue("--book-cover-with-large") != null ||
  rootStyles.getPropertyValue("--book-cover-with-large") !== ""
) {
  ready();
} else {
  document.getElementById("main-css").addEventListener("load", ready);
}
function ready() {
  const coverWidth = parseFloat(
    rootStyles.getPropertyValue("--book-cover-with-large")
  );
  const coverAspectRatio = parseFloat(
    rootStyles.getPropertyValue("--book-cover-aspect-ratio")
  );
  const coverHeight = parseFloat(coverWidth / coverAspectRatio);
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );
  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
  });
  FilePond.parse(document.body);
}
