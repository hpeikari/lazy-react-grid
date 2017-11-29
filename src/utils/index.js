/********************************************************
      Equality Checks
********************************************************/
export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


/********************************************************
      Value Formatters
*********************************************************/
export const valueFormatterForString = (value) => {
  return ((value !== null) && (value !== undefined) && value.toString()) || '';
};


/********************************************************
        miscellaneous
********************************************************/
export const getScrollbarWidth = () => {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";

  // add innerdiv
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  var widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}
