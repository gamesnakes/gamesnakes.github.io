function logEventGame(id, type) {
  analytics.logEvent(id, {
    type: type,
  });
}

function loadGame(slug) {
  fetch("game/all.json", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      listGame = data;
      for (var j = 0; j < listGame.length; j++) {
        if (listGame[j].slug == slug) {
          var tmp_url = "";
          if (listGame[j].domain == 1) {
            tmp_url = "https://webglmath.github.io/" + slug + "/";
          } else if (listGame[j].domain == 2) {
            tmp_url = "https://ubg77.github.io/edit/" + slug + "/";
          } else if (listGame[j].domain == 3) {
            tmp_url = "https://ubg77.github.io/game131022/" + slug + "/";
          } else if (listGame[j].domain == 4) {
            tmp_url = "https://ubg77.github.io/fix/" + slug + "/";
            if (slug.indexOf("fnaf2") != -1) {
              tmp_url = "https://ubg77.github.io/fix/" + slug;
            }
          }
          document.getElementById("gameframe").setAttribute("src", tmp_url);
          // $('#gameframe').src = tmp_url;
          //$("html, body").animate({ scrollTop: 0 }, "slow");
          break;
        }
      }
    });
}
var search = window.location.search;
if (search) {
  // loadGame(search.replace('?class=',''));
  //addAdsClass();
}

function open_fullscreen() {
  let game = document.getElementById("game-element");
  if (game.requestFullscreen) {
    game.requestFullscreen();
  } else if (game.mozRequestFullScreen) {
    /* Firefox */
    game.mozRequestFullScreen();
  } else if (game.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    game.webkitRequestFullscreen();
  } else if (game.msRequestFullscreen) {
    /* IE/Edge */
    game.msRequestFullscreen();
  }
}
function playGame() {
  var tmp = document.querySelector("#game-arena").dataset.url;
  document.querySelector(
    "#game-arena"
  ).innerHTML = `<iframe id="game-element" allowfullscreen="" allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write" name="gameFrame" scrolling="no" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads" src="${tmp}"></iframe>`;
}

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

      gtag("config", "G-Z3V7121CYN", {
        cookie_flags: "SameSite=None;Secure",
      });
    }),
    document.head.appendChild(r);
}
setTimeout(() => {
  document.querySelector(".text-survey").style.display = "none";
}, 3000);
window.addEventListener("load", function () {
  loadGA();
  fetch("/json/all.json", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      listGame = data;
      var html = "";
      for (var j = 0; j < listGame.length; j++) {
        var tmp = "";
        var item = listGame[j];
        var slug = item.slug;
        if (slug == "/") {
          slug = "/";
        } else {
          slug = `/${item.slug}.html`;
        }
        html += `<a href="${slug}" class="sc-wr3rvk-0 jcoQuw sc-963fcq-3 djzSvC sc-al88rd-4">
            <img src="${item.img}" alt="${item.title}" loading="lazy" width="94" height="94" decoding="async" class="sc-18mcksl-1 jQcWfv">
            <span class="sc-963fcq-0 ibRKmB global-cq-title">${item.title}</span>
          </a>`;
      }
      document.querySelector("#listgame").innerHTML = html;
    });
});
function showPopup() {
  // todo: show retrobowl.click website in new tab
  window.open("https://retrobowl.click", "_blank");

  // document.querySelector(".popup-survey").style.display = "block";
}
function closePopup() {
  document.querySelector(".popup-survey").style.display = "none";
}
