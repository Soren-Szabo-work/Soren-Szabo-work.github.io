
function main() {
  console.clear();

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // disable cursor
    console.log('mobile device detected, disabling custom cursor');
    return;
  }

  const { gsap, CircleType } = window;

  const cursor = $('<div/>').addClass('cursor');

  const cursorOuter = $('<div/>').addClass('cursor--large'); //document.querySelector(".cursor--large");
  const cursorInner = $('<div/>').addClass('cursor--small'); //document.querySelector(".cursor--small");
  //const cursorTextContainerEl = $('<div/>').addClass('cursor--text');//document.querySelector(".cursor--text");
  // const cursorTextEl = $('<div/>').addClass('text').text('GO HERE! GO HERE! GO HERE! GO HERE!');//cursorTextContainerEl.querySelector(".text");

  $("#main").append(cursor);
  cursor.append(cursorOuter).append(cursorInner);//.append(cursorTextContainerEl)
  // cursorTextContainerEl.append(cursorTextEl);

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const hoverItems = document.querySelectorAll(".cursor-hover-item");
  const hoverEffectDuration = 0.1;
  const idleEffectDuration = 0.25;
  const cursorFollowSpeed = 0.3;

  let isHovered = false;
  let isIdle = false;
  // let initialCursorHeight;
  let cursorIdleTimeout = null;
  let cursorIdleDelay = 2000;
  let
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    dt = 0;

  // const cursorRotationDuration = 8;

  // let circleType = new CircleType(cursorTextEl[0]);
  // circleType.radius(50);

  // setTimeout(() => {
  //   initialCursorHeight = circleType.container.style.getPropertyValue("height");
  //   console.log(initialCursorHeight);
  // }, 50);

  hoverItems.forEach((item) => {
    item.addEventListener("pointerenter", handlePointerEnter);
    item.addEventListener("pointerleave", handlePointerLeave);
  });

  let mouse = {
    x: -100,
    y: -100
  };

  let oldMouse = { x: -100, y: -100 };

  const xSet = gsap.quickSetter(cursorOuter, "x", "px");
  const ySet = gsap.quickSetter(cursorOuter, "y", "px");

  document.body.addEventListener("pointermove", updateCursorPosition);

  function updateCursorPosition(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function setCursorIdle(state) {
    isIdle = state;

    gsap.to(cursorOuter, idleEffectDuration, { opacity: (state ? 0 : 1) });
  }

  function updateCursor() {

    gsap.set(cursorInner, {
      x: mouse.x,
      y: mouse.y
    });

    const deltaSpeed = cursorFollowSpeed * dt / 0.016;

    pos.x += (mouse.x - pos.x) * deltaSpeed;
    pos.y += (mouse.y - pos.y) * deltaSpeed;
    xSet(pos.x);
    ySet(pos.y);

    // gsap.to(cursorOuter, {
    //   duration: 0.2,
    //   x: mouse.x,
    //   y: mouse.y
    // });

    if (mouse.x != oldMouse.x || mouse.y != oldMouse.y) {

      if (cursorIdleTimeout) {
        clearInterval(cursorIdleTimeout);
        cursorIdleTimeout = null;
      }

      if (isIdle)
        setCursorIdle(false);


      oldMouse.x = mouse.x;
      oldMouse.y = mouse.y;

      cursorIdleTimeout = null;
    }
    else if (!cursorIdleTimeout)
      cursorIdleTimeout = setTimeout(function () { setCursorIdle(true) }, cursorIdleDelay);



    // if (!isHovered) {
    //   gsap.to(cursorTextContainerEl, hoverEffectDuration * 0.5, {
    //     opacity: 0
    //   });
    //   gsap.set(cursorTextContainerEl, {
    //     rotate: 0
    //   });
    // }

    // requestAnimationFrame(updateCursor);
  }

  function handlePointerEnter(e) {
    isHovered = true;

    // gsap.set(cursorTextContainerEl, {
    //   height: initialCursorHeight,
    //   width: initialCursorHeight
    // });

    const target = e.currentTarget;
    // updateCursorText(target);

    // gsap.fromTo(
    //   cursorTextContainerEl,
    //   {
    //     rotate: 0
    //   },
    //   {
    //     duration: cursorRotationDuration,
    //     rotate: 360,
    //     ease: "none",
    //     repeat: -1
    //   }
    // );

    gsap.to(cursorInner, hoverEffectDuration, {
      scale: 2
    });

    //   gsap.fromTo(
    //     cursorTextContainerEl,
    //     hoverEffectDuration,
    //     {
    //       scale: 1.2,
    //       opacity: 0
    //     },
    //     {
    //       delay: hoverEffectDuration * 0.75,
    //       scale: 1,
    //       opacity: 1
    //     }
    //   );
    //   gsap.to(cursorOuter, hoverEffectDuration, {
    //     scale: 1.2,
    //     opacity: 0
    //   });
  }

  function handlePointerLeave() {
    isHovered = false;
    gsap.to([cursorInner, cursorOuter], hoverEffectDuration, {
      scale: 1,
      opacity: 1
    });
  }

  // function updateCursorText(textEl) {
  //   const cursorTextRepeatTimes = textEl.getAttribute("data-cursor-text-repeat");
  //   const cursorText = returnMultipleString(
  //     textEl.getAttribute("data-cursor-text"),
  //     cursorTextRepeatTimes
  //   );

  //   circleType.destroy();
  //   cursorTextEl.text(cursorText);

  //   circleType = new CircleType(cursorTextEl[0]);
  // }

  // function returnMultipleString(string, count) {
  //   console.log(string, count);
  //   string = !!string ? string : "GO HERE!";
  //   count = !!count ? count : 4;
  //   let s = "";
  //   for (let i = 0; i < count; i++) {
  //     s += ` ${string} `;
  //   }
  //   console.log(s);
  //   return s;
  // }

  function updateLoop() {
    currentTime = (new Date()).getTime();
    dt = (currentTime - lastTime) / 1000;

    updateCursor();

    lastTime = currentTime;
    requestAnimationFrame(updateLoop);
  }

  updateLoop();
}

$(document).ready(main);