/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // - STORAGE
  function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
  //

  // Touch?
  if (browser.mobile) $body.addClass("is-touch");

  // Theme switch - toggle
  let $btnTheme = $(".theme-toggle");
  const darkThemeClass = "dark-theme";

  // update button visuals
  function updateThemeIcon(enabled) {
    let outX = $btnTheme.width() * 1.1;
    $btnTheme.find("g").css({
      transform: enabled ? `translateY(${outX}px)` : "none",
      "transform-origin": "0px 0px 0px",
    });
    $btnTheme
      .find("svg")
      .children("path")
      .css({
        transform: enabled ? "none" : `translateY(${outX}px)`,
        "transform-origin": "0px 0px 0px",
      });
  }

  // add dark theme class
  function setDarkTheme(e) {
    if (e) document.body.classList.add(darkThemeClass);
    else document.body.classList.remove(darkThemeClass);
    updateThemeIcon(e);
  }

  // check if dark mode has been enabled before
  if (storageAvailable("localStorage")) {
    let isDarkTheme = localStorage.getItem(darkThemeClass) === "true";
    if (isDarkTheme != null) {
      $body.addClass("no-transition");
      setDarkTheme(isDarkTheme);
      setTimeout(() => $body.removeClass("no-transition"), 100);
    }
  }

  // add btn/switch click listener
  $btnTheme.click(function (e) {
    e.preventDefault();

    let enabled = document.body.classList.toggle(darkThemeClass);
    updateThemeIcon(enabled);

    if (storageAvailable("localStorage"))
      localStorage.setItem(darkThemeClass, enabled);
  });
  // iFrame video player

  // Inject YouTube API script
  if (!browser.mobile) {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // this function gets called when API is ready to use
    window.onYouTubePlayerAPIReady = function () {
      // global variable for the player
      var $videos = $(".video-container");
      $videos.each(function () {
        injectVideoPlayer(this);
      });
    };

    function injectVideoPlayer(container) {
      // create the global player from the specific iframe (#video)
      let $placeholder = $(container).find("div");
      let id = $placeholder[0].id;

      let player = new YT.Player(id, {
        videoId: id,
        playerVars: {
          origin: window.location.origin,
          playlist: id,
          loop: 1,
          rel: 0,
          controls: 0,
          modestbranding: 1,
        },
        events: {
          // call this function when player is ready to use
          onReady: function (e) {
            initVideoEvents(container, player);
          }, // works with e.target (== player)
        },
      });
    }

    function initVideoEvents(container, player) {
      let $c = $(container);
      let iframe = player.g;

      $c.on("keydown", function (e) {
        console.log(e.keyCode + " pressed");
        switch (e.keyCode) {
          // F
          case 70:
            if (!$(iframe).hasClass("fullscreen")) {
              let requestFullScreen =
                iframe.requestFullScreen ||
                iframe.mozRequestFullScreen ||
                iframe.webkitRequestFullScreen;
              if (requestFullScreen) {
                requestFullScreen.bind(iframe)();
                $(iframe).addClass("fullscreen");
              }
            } else {
              let exitFullscreen =
                document.exitFullscreen ||
                document.mozCancelFullScreen ||
                document.webkitExitFullscreen ||
                document.msExitFullscreen;
              if (exitFullscreen) {
                exitFullscreen.bind(document)();
                $(iframe).removeClass("fullscreen");
              }
            }
            break;
          // K | SPACEBAR
          case 75:
          case 32:
            togglePlayerPlay($c, player);
            break;
          // M
          case 77:
            togglePlayerMute(player);
            break;
          default:
            break;
        }
      });

      container.addEventListener("click", function () {
        togglePlayerPlay($c, player);
      });
    }

    function togglePlayerPlay($container, player) {
      if ($container.hasClass("video--playing")) {
        $container.removeClass("video--playing");
        player.pauseVideo();
      } else {
        $container.addClass("video--playing");
        player.playVideo();
      }
    }

    function togglePlayerMute(player) {
      if (player.isMuted()) {
        player.unMute();
      } else {
        player.mute();
      }
    }
  }

  // Forms.
  var $form = $("form");

  // Auto-resizing textareas.
  $form.find("textarea").each(function () {
    var $this = $(this),
      $wrapper = $('<div class="textarea-wrapper"></div>'),
      $submits = $this.find('input[type="submit"]');

    $this
      .wrap($wrapper)
      .attr("rows", 1)
      .css("overflow", "hidden")
      .css("resize", "none")
      .on("keydown", function (event) {
        if (event.keyCode == 13 && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();

          $(this).blur();
        }
      })
      .on("blur focus", function () {
        $this.val($.trim($this.val()));
      })
      .on("input blur focus --init", function () {
        $wrapper.css("height", $this.height());

        $this
          .css("height", "auto")
          .css("height", $this.prop("scrollHeight") + "px");
      })
      .on("keyup", function (event) {
        if (event.keyCode == 9) $this.select();
      })
      .triggerHandler("--init");

    // Fix.
    if (browser.name == "ie" || browser.mobile)
      $this.css("max-height", "10em").css("overflow-y", "auto");
  });

  // Menu.
  var $menu = $("#menu");

  $menu.wrapInner('<div class="inner"></div>');

  $menu._locked = false;

  $menu._lock = function () {
    if ($menu._locked) return false;

    $menu._locked = true;

    window.setTimeout(function () {
      $menu._locked = false;
    }, 350);

    return true;
  };

  $menu._show = function () {
    if ($menu._lock()) $body.addClass("is-menu-visible");
  };

  $menu._hide = function () {
    if ($menu._lock()) $body.removeClass("is-menu-visible");
  };

  $menu._toggle = function () {
    if ($menu._lock()) $body.toggleClass("is-menu-visible");
  };

  $menu
    .appendTo($body)
    .on("click", function (event) {
      event.stopPropagation();
    })
    .on("click", "a", function (event) {
      var href = $(this).attr("href");

      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $menu._hide();

      // Redirect.
      if (href == "#menu") return;

      window.setTimeout(function () {
        window.location.href = href;
      }, 350);
    })
    .append('<a class="close" href="#menu">Close</a>');

  $body
    .on("click", 'a[href="#menu"]', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Toggle.
      $menu._toggle();
    })
    .on("click", function (event) {
      // Hide.
      $menu._hide();
    })
    .on("keydown", function (event) {
      // Hide on escape.
      if (event.keyCode == 27) $menu._hide();
    });
})(jQuery);
