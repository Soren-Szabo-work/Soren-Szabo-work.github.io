function main() {
  // console.clear();

  if ($("body").hasClass("is-touch")) {
    // disable cursor
    console.log("mobile device detected, disabling custom cursor");
    return;
  }

  const { gsap } = window;

  const cursor = $("<div/>").addClass("cursor");

  const cursorOuter = $("<div/>").addClass("cursor--large");
  const cursorInner = $("<div/>").addClass("cursor--small");

  $("#main").append(cursor);
  cursor.append(cursorOuter).append(cursorInner);

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const hoverItems = document.querySelectorAll(".cursor-hover-item");
  const hoverEffectDuration = 0.1;
  const idleEffectDuration = 0.25;
  const cursorFollowSpeed = 0.3;

  let isHovered = false;
  let isIdle = false;
  let isDisabled = false;
  let cursorIdleTimeout = null;
  let cursorIdleDelay = 2000;
  let lastTime = new Date().getTime(),
    currentTime = 0,
    dt = 0;

  hoverItems.forEach((item) => {
    item.addEventListener("pointerenter", handlePointerEnter);
    item.addEventListener("pointerleave", handlePointerLeave);
  });

  let mouse = {
    x: -100,
    y: -100,
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

    gsap.to(cursorOuter, idleEffectDuration, { opacity: state ? 0 : 1 });
  }

  function updateCursor() {
    gsap.set(cursorInner, {
      x: mouse.x,
      y: mouse.y,
    });

    const deltaSpeed = (cursorFollowSpeed * dt) / 0.016;

    pos.x += (mouse.x - pos.x) * deltaSpeed;
    pos.y += (mouse.y - pos.y) * deltaSpeed;
    xSet(pos.x);
    ySet(pos.y);

    if (isHovered || mouse.x != oldMouse.x || mouse.y != oldMouse.y) {
      if (cursorIdleTimeout) {
        clearInterval(cursorIdleTimeout);
        cursorIdleTimeout = null;
      }

      if (isIdle) {
        setCursorIdle(false);
        xSet(mouse.x);
        ySet(mouse.y);
      }

      oldMouse.x = mouse.x;
      oldMouse.y = mouse.y;

      cursorIdleTimeout = null;
    } else if (!cursorIdleTimeout)
      cursorIdleTimeout = setTimeout(function () {
        setCursorIdle(true);
      }, cursorIdleDelay);
  }

  function handlePointerEnter(e) {
    isHovered = true;

    const target = e.currentTarget;

    gsap.to(cursorInner, hoverEffectDuration, {
      scale: 2,
    });
  }

  function handlePointerLeave() {
    isHovered = false;
    gsap.to([cursorInner, cursorOuter], hoverEffectDuration, {
      scale: 1,
      opacity: 1,
    });
  }

  function updateLoop() {
    currentTime = new Date().getTime();
    dt = (currentTime - lastTime) / 1000;

    updateCursor();

    lastTime = currentTime;
    requestAnimationFrame(updateLoop);
  }

  updateLoop();
}

$(document).ready(main);
