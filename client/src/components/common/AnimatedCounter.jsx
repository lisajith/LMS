import { useEffect, useRef } from "react";
import gsap from "gsap";

function AnimatedCounter({ value }) {
  const ref = useRef();

  useEffect(() => {
    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        ref.current.textContent = Math.round(obj.val);
      },
    });
  }, [value]);

  return <span ref={ref}>0</span>;
}

export default AnimatedCounter;