var Slider = function (domNode)  {

  this.domNode = domNode;
  this.railDomNode = domNode.parentNode;

  this.labelDomNode = false;
  this.minDomNode = false;
  this.maxDomNode = false;

  this.valueNow = 50;

  this.railMin = 0;
  this.railMax = 100;
  this.railWidth = 0;
  this.railBorderWidth = 1;

  this.thumbWidth  = 20;
  this.thumbHeight = 24;

  this.keyCode = Object.freeze({
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'pageUp': 33,
    'pageDown': 34,
    'end': 35,
    'home': 36
  });
};
let train=document.getElementById("Train");
let test=document.getElementById("Test");
let valid=document.getElementById("Valid");

let value_array=document.querySelectorAll('[role=slider]');

// Initialize slider
Slider.prototype.init = function () {

  if (this.domNode.previousElementSibling) {
    this.minDomNode = this.domNode.previousElementSibling;
    this.railMin = parseInt((this.minDomNode.getAttribute('aria-valuemin')));
  }
  else {
    this.railMin = parseInt((this.domNode.getAttribute('aria-valuemin')));
  };

  if (this.domNode.nextElementSibling) {
    this.maxDomNode = this.domNode.nextElementSibling;
    this.railMax = parseInt((this.maxDomNode.getAttribute('aria-valuemax')));
  }

  else {
    this.railMax = parseInt((this.domNode.getAttribute('aria-valuemax')));
  }

  this.valueNow = parseInt((this.domNode.getAttribute('aria-valuenow')));
  // train.innerHTML=value_array[0].ariaValueNow;
  // valid.innerHTML=(100-(value_array[1].ariaValueNow));
  // test.innerHTML= (100-(train.innerHTML)-(valid.innerHTML));

  this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  if (this.domNode.classList.contains('min')) {
    this.labelDomNode = this.domNode.parentElement.previousElementSibling;
  }

  if (this.domNode.classList.contains('max')) {
    this.labelDomNode = this.domNode.parentElement.nextElementSibling;
  }

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.addEventListener('keydown',    this.handleKeyDown.bind(this));
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

  this.moveSliderTo(this.valueNow);
  // train.innerHTML=value_array[0].ariaValueNow;
  // valid.innerHTML=(100-(value_array[1].ariaValueNow));
  // test.innerHTML= (100-(train.innerHTML)-(valid.innerHTML));

};

Slider.prototype.moveSliderTo = function (value) {
  var valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  var valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));

  if (value > valueMax) {
    value = valueMax;
  }

  if (value < valueMin) {
    value = valueMin;
  }

  this.valueNow = value;
  this.dolValueNow = '$' + value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);
  train.innerHTML=value_array[0].ariaValueNow;
  test.innerHTML=(100-(value_array[1].ariaValueNow));
  valid.innerHTML= (100-(train.innerHTML)-(test.innerHTML));
  document.querySelector(".rail").style.background=`linear-gradient(to right,red 0% ${train.innerHTML}%,yellow ${train.innerHTML}% ${100 - test.innerHTML}%,green ${100 - test.innerHTML}% 100%)`;
  this.domNode.setAttribute('aria-valuetext', this.dolValueNow);

  if (this.minDomNode) {
    this.minDomNode.setAttribute('aria-valuemax', this.valueNow);
    train.innerHTML=value_array[0].ariaValueNow;
    test.innerHTML=(100-(value_array[1].ariaValueNow));
    valid.innerHTML= (100-(train.innerHTML)-(test.innerHTML));
    document.querySelector(".rail").style.background=`linear-gradient(to right,red 0% ${train.innerHTML}%,yellow ${train.innerHTML}% ${100 - test.innerHTML}%,green ${100 - test.innerHTML}% 100%)`;
  }

  if (this.maxDomNode) {
    this.maxDomNode.setAttribute('aria-valuemin', this.valueNow);
    train.innerHTML=value_array[0].ariaValueNow;
    test.innerHTML=(100-(value_array[1].ariaValueNow));
    valid.innerHTML= (100-(train.innerHTML)-(test.innerHTML));
    document.querySelector(".rail").style.background=`linear-gradient(to right,red 0% ${train.innerHTML}%,yellow ${train.innerHTML}% ${100 - test.innerHTML}%,green ${100 - test.innerHTML}% 100%)`;
  }

  var pos = Math.round(((this.valueNow - this.railMin) * (this.railWidth - 2 * (this.thumbWidth - this.railBorderWidth))) / (this.railMax - this.railMin));

  if (this.minDomNode) {
    this.domNode.style.left = (pos + this.thumbWidth - this.railBorderWidth) + 'px';
  }
  else {
    this.domNode.style.left = (pos - this.railBorderWidth) + 'px';
  }

  if (this.labelDomNode) {
    this.labelDomNode.innerHTML = this.dolValueNow.toString();
  }
};

Slider.prototype.handleKeyDown = function (event) {

  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.left:
    case this.keyCode.down:
      this.moveSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.right:
    case this.keyCode.up:
      this.moveSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.pageDown:
      this.moveSliderTo(this.valueNow - 10);
      flag = true;
      break;

    case this.keyCode.pageUp:
      this.moveSliderTo(this.valueNow + 10);
      flag = true;
      break;

    case this.keyCode.home:
      this.moveSliderTo(this.railMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveSliderTo(this.railMax);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.preventDefault();
    event.stopPropagation();
  }

};

Slider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

Slider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

Slider.prototype.handleMouseDown = function (event) {

  var self = this;

  var handleMouseMove = function (event) {

    var diffX = event.pageX - self.railDomNode.offsetLeft;
    self.valueNow = self.railMin + parseInt(((self.railMax - self.railMin) * diffX) / self.railWidth);
    self.moveSliderTo(self.valueNow);

    event.preventDefault();
    event.stopPropagation();
  };

  var handleMouseUp = function (event) {

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

  };

    // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', handleMouseMove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', handleMouseUp);

  event.preventDefault();
  event.stopPropagation();

  // Set focus to the clicked handle
  this.domNode.focus();

};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
// Slider.prototype.handleClick = function (event) {

//  var diffX = event.pageX - this.railDomNode.offsetLeft;
//  this.valueNow = parseInt(((this.railMax - this.railMin) * diffX) / this.railWidth);
//  this.moveSliderTo(this.valueNow);

//  event.preventDefault();
//  event.stopPropagation();

// };

// Initialise Sliders on the page
window.addEventListener('load', function () {

  var sliders = document.querySelectorAll('[role=slider]');;

  for (var i = 0; i < sliders.length; i++) {
    var s = new Slider(sliders[i]);
    // train.innerHTML=value_array[0].ariaValueNow;
    // valid.innerHTML=(100-value_array[1].ariaValueNow);
    // test.innerHTML= (100-train.innerHTML-valid.innerHTML);

    s.init();
  }

});

// let train=document.getElementById("Train");
// let test=document.getElementsByClassName("Test");
// let valid=document.getElementsByClassName("Valid");

// let value_array=document.querySelectorAll('[role=slider]');

// train.innerHTML=value_array[0].ariaValueNow;

// document.querySelector(".rail").style.background=`linear-gradient(to right,red 0% ${train.innerHTML}%,yellow ${train.innerHTML}% ${100 - test.innerHTML}%,green ${100 - test.innerHTML}% 100%)`;