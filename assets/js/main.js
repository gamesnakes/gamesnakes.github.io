(function ($) {
  "use strict";
  $(window).on("load", function (event) {
    $(".js-preloader").delay(500).fadeOut(500);
  });
  $(".searchbtn").on("click", function () {
    $(".search-area").toggleClass("open");
  });
  $(".close-searchbox").on("click", function () {
    $(".search-area").removeClass("open");
  });
  $("[data-countdown]").each(function () {
    var $this = $(this),
      finalDate = $(this).data("countdown");
    $this.countdown(finalDate, function (event) {
      $this.html(
        event.strftime(
          '<div class="cdown day"><span class="time-count">%-D</span> <p>Days</p></div> <div class="cdown hour"><span class="time-count">%-H</span> <p>Hours</p></div> <div class="cdown minutes"><span class="time-count">%M</span> <p>Minutes</p></div> <div class="cdown second"><span class="time-count">%S</span> <p>Seconds</p></div>'
        )
      );
    });
  });
  $(".hero-wrap").mousemove(function (e) {
    var wx = $(window).width();
    var wy = $(window).height();
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var newx = x - wx / 2;
    var newy = y - wy / 2;
    $(".hero-content").each(function () {
      var speed = $(this).attr("data-speed");
      if ($(this).attr("data-revert")) speed *= -0.4;
      TweenMax.to($(this), 1, {
        x: 1 - newx * speed,
        y: 1 - newy * speed,
      });
    });
  });
  $(".hero-img-slider").owlCarousel({
    nav: false,
    dots: true,
    loop: true,
    margin: 20,
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
  });
  $(".auction-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });
  $(".popular-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
      1400: {
        items: 4,
      },
    },
  });
  $(".collection-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 2.4,
      },
      1200: {
        items: 3.2,
      },
      1400: {
        items: 3.8,
      },
    },
  });
  $(".volume-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });
  $(".testimonial-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 2,
      },
    },
  });
  $(".editor-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 25,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1.5,
      },
      768: {
        items: 2.3,
      },
      1200: {
        items: 3.5,
      },
      1600: {
        items: 4.5,
      },
    },
  });
  $(".category-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });
  $(".author-slider-one").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
      1400: {
        items: 4,
      },
    },
  });
  $(".author-slider-two").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 3,
      },
      1400: {
        items: 4,
      },
    },
  });
  $(".blog-slider").owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    margin: 20,
    navText: [
      '<i class="flaticon-left-arrow-1"></i>',
      '<i class="flaticon-next-1"></i>',
    ],
    items: 1,
    thumbs: false,
    smartSpeed: 1300,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    responsiveClass: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1200: {
        items: 2.4,
      },
      1200: {
        items: 3.2,
      },
      1400: {
        items: 3.8,
      },
    },
  });
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 8000,
    values: [1200, 3000],
    slide: function (event, ui) {
      $("#amount_one").val(ui.values[0] + " - " + " $" + ui.values[1]);
    },
  });
  $("#amount_one").val(
    "$ " +
      $("#slider-range").slider("values", 0) +
      " - " +
      "$ " +
      $("#slider-range").slider("values", 1)
  );
  var wind = $(window);
  var sticky = $(".header-wrap");
  wind.on("scroll", function () {
    var scroll = wind.scrollTop();
    if (scroll < 100) {
      sticky.removeClass("sticky");
    } else {
      sticky.addClass("sticky");
    }
  });
  $(window).on("resize", function () {
    if ($(window).width() <= 1199) {
      $(".collapse.navbar-collapse").removeClass("collapse");
    } else {
      $(".navbar-collapse").addClass("collapse");
    }
  });
  $(".mobile-menu a").on("click", function () {
    $(".main-menu-wrap").addClass("open");
    $(".collapse.navbar-collapse").removeClass("collapse");
  });
  $(".mobile_menu a").on("click", function () {
    $(this).parent().toggleClass("open");
    $(".main-menu-wrap").toggleClass("open");
  });
  $(".menu-close").on("click", function () {
    $(".main-menu-wrap").removeClass("open");
  });
  $(".mobile-top-bar").on("click", function () {
    $(".header-top").addClass("open");
  });
  $(".close-header-top button").on("click", function () {
    $(".header-top").removeClass("open");
  });
  var $offcanvasNav = $(".navbar-nav"),
    $offcanvasNavSubMenu = $offcanvasNav.find(".dropdown-menu");
  $offcanvasNavSubMenu
    .parent()
    .prepend(
      '<span class="menu-expand"><i class="ri-arrow-down-s-line"></i></span>'
    );
  $offcanvasNavSubMenu.slideUp();
  $offcanvasNav.on("click", "li a, li .menu-expand", function (e) {
    var $this = $(this);
    if ($this.attr("href") === "#" || $this.hasClass("menu-expand")) {
      e.preventDefault();
      if ($this.siblings("ul:visible").length) {
        $this.siblings("ul").slideUp("slow");
      } else {
        $this.closest("li").siblings("li").find("ul:visible").slideUp("slow");
        $this.siblings("ul").slideDown("slow");
      }
    }
    if (
      $this.is("a") ||
      $this.is("span") ||
      $this.attr("class").match(/\b(menu-expand)\b/)
    ) {
      $this.parent().toggleClass("menu-open");
    } else if (
      $this.is("li") &&
      $this.attr("class").match(/\b('dropdown-menu')\b/)
    ) {
      $this.toggleClass("menu-open");
    }
  });
  AOS.init();
  function BackToTop() {
    $(".back-to-top").on("click", function () {
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        100
      );
      return false;
    });
    $(document).scroll(function () {
      var y = $(this).scrollTop();
      if (y > 600) {
        $(".back-to-top").fadeIn();
        $(".back-to-top").addClass("open");
      } else {
        $(".back-to-top").fadeOut();
        $(".back-to-top").removeClass("open");
      }
    });
  }
  BackToTop();
})(jQuery);
function setTheme(themeName) {
  localStorage.setItem("nedo_theme", themeName);
  document.documentElement.className = themeName;
}
function toggleTheme() {
  if (localStorage.getItem("nedo_theme") === "theme-dark") {
    setTheme("theme-light");
  } else {
    setTheme("theme-dark");
  }
}
(function () {
  if (localStorage.getItem("nedo_theme") === "theme-dark") {
    setTheme("theme-dark");
    document.getElementById("slider").checked = false;
  } else {
    setTheme("theme-light");
    document.getElementById("slider").checked = true;
  }
})();
function loadGA() {
  var r = document.createElement("script");
  r.setAttribute(
    "src",
    "https://www.googletagmanager.com/gtag/js?id=G-Z3V7121CYN"
  ),
    r.setAttribute("type", "text/javascript"),
    r.setAttribute("crossOrigin", "anonymous"),
    (r.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-Z3V7121CYN");
    }),
    document.head.appendChild(r);
}
window.addEventListener("load", function () {
  // loadGA()
});
function showPopup() {
  document.querySelector(".popup-survey").style.display = "block";
}
function closePopup() {
  document.querySelector(".popup-survey").style.display = "none";
}
