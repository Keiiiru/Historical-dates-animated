import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.sass";
import { pages } from "../../shared/constants.ts";
import Button from "../../widgets/button/index.tsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Article from "./ui/articles/index.tsx";
import ArrowLeftIcon from "../../shared/icons/ArrowLeftIcon.tsx";
import ArrowRightIcon from "../../shared/icons/ArrowRightIcon.tsx";
import TextPlugin from "gsap/TextPlugin";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(TextPlugin);

const HomePage = () => {
  const [pageId, setPageId] = useState<number>(1);
  const [points, setPoints] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const yearToRef = useRef<any>(null);
  const yearFromRef = useRef<any>(null);
  const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const generateCirclePoints = (numPoints: number, radius: number) => {
    const angleStep = (2 * Math.PI) / numPoints;
    let pointsArr: any = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep + -4.19;
      const x = Math.round(Math.cos(angle) * radius);
      const y = Math.round(Math.sin(angle) * radius);
      pointsArr.push({ id: i + 1, x, y });
    }

    setPoints(pointsArr);
  };

  useEffect(() => generateCirclePoints(pages.length, 150), []);

  // Animation for years
  useGSAP(() => {
    if (yearFromRef.current) {
      gsap.to(yearFromRef.current, {
        innerText: pages[pageId - 1].yearFrom,
        roundProps: "innerText",
      });
    }
    if (yearToRef.current) {
      gsap.to(yearToRef.current, {
        innerText: pages[pageId - 1].yearTo,
        roundProps: "innerText",
      });
    }
  }, [pageId]);

  // Animation for points at the circle
  useGSAP(() => {
    let angleDiff = 0;
    points.forEach((point) => {
      if (point.id === pageId) {
        const initialAngle = Math.atan2(point.x, point.y) * (180 / Math.PI);
        if (initialAngle > -30) {
          angleDiff = initialAngle + 30;
        } else {
          angleDiff = -(-30 - initialAngle);
        }
      }
    });
    // Calculation the angle for every point
    points.forEach((point) => {
      const dx = point.x;
      const dy = point.y;
      const initialRadius = Math.sqrt(dx * dx + dy * dy);
      const initialAngle = Math.atan2(dy, dx);
      const initialRotation = initialAngle * (180 / Math.PI);

      gsap.set(point, { rotation: initialRotation });

      // Point animation configuration
      const animationConfig = {
        duration: 1.2,
        onUpdate: () => {
          const currentAngle =
            (gsap.getProperty(point, "rotation") as number) * (Math.PI / 180);
          const newX = Math.cos(currentAngle) * initialRadius;
          const newY = Math.sin(currentAngle) * initialRadius;
          setPoints((prev) =>
            prev.map((p) =>
              p.id === point.id ? { ...p, x: newX, y: newY } : p
            )
          );
        },
      };

      gsap.to(point, {
        rotation: `+=${angleDiff}`,
        ...animationConfig,
      });
    });

    // Animation for pagination container
    const tl = gsap.timeline();

    tl.to(".container__articles", {
      opacity: 1,
    })
      .to(".container__articles", {
        opacity: 0,
      })
      .to(".container__articles", {
        opacity: 1,
      });
  }, [pageId]);

  const handleMouseEnter = (index: number) => {
    if (pages[index].id === pageId) return;

    const point = pointRefs.current[index];
    const button = buttonRefs.current[index];
    if (!point || !button) return;

    gsap.to(point, {
      width: 20,
      height: 20,
      left: -10,
      top: -10,
      duration: 0.3,
    });

    gsap.to(button, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
    });
  };

  const handleMouseLeave = (index: number) => {
    if (pages[index].id === pageId) return;

    const point = pointRefs.current[index];
    const button = buttonRefs.current[index];
    if (!point || !button) return;

    gsap.to(point, {
      width: 5,
      height: 5,
      left: -2,
      top: -2,
      duration: 0.3,
    });

    gsap.to(button, {
      opacity: 0,
      scale: 0,
      duration: 0.3,
    });
  };

  function handleClick(index: number) {
    setPageId(index + 1);
  }

  // Rendering points
  let circlePoints = useMemo(() => {
    return points.map((el, index) => (
      <div
        key={index}
        ref={(el: any) => (pointRefs.current[index] = el)}
        className={`container__point ${
          pageId === pages[index].id ? "active" : ""
        }`}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={() => handleMouseLeave(index)}
        onClick={() => handleClick(index)}
        style={{
          width: pageId === pages[index].id ? 20 : 5,
          height: pageId === pages[index].id ? 20 : 5,
          left: pageId === pages[index].id ? -10 : -2.5,
          top: pageId === pages[index].id ? -10 : -2.5,
          transform: `translate(${150 - el.x}px, ${150 - el.y}px)`,
        }}
      >
        <Button
          ref={(el) => (buttonRefs.current[index] = el)}
          className="button container__circle-btn"
          style={pageId === pages[index].id ? { transform: "scale(1)" } : {}}
        >
          {index + 1}
        </Button>
      </div>
    ));
  }, [points, pageId]);

  //rendering page
  return (
    <div className="container">
      <header className="container__page-title">
        <div></div>
        <span className="container__title">Исторические даты</span>
      </header>

      <section className="container__circle-container">
        <div className="container__circle">
          <div className="container__years">
            <span className="container__years-from" ref={yearFromRef}>
              0
            </span>
            <span className="container__years-to" ref={yearToRef}>
              0
            </span>
          </div>
          <div className="circle">{circlePoints}</div>
        </div>
      </section>
      <section className="container__articles">
        <div className="container__pagination">
          <span className="container__pagination-page">{`0${pageId} / 0${pages.length}`}</span>
          <div className="container__buttons">
            <Button
              className="button container__left-button"
              onClick={() => setPageId((prev) => --prev)}
              disabled={pageId === 1 ? true : false}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              className=" button container__right-button"
              onClick={() => setPageId((prev) => ++prev)}
              disabled={pageId === pages.length ? true : false}
            >
              <ArrowRightIcon />
            </Button>
            <div className="container__pagination-points">
              {points.map((el) => (
                <div
                  key={el.id}
                  className={`container__pagination-point ${
                    el.id === pageId ? "" : "opacity"
                  }`}
                  onClick={() => setPageId(el.id)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="swiper">
          {pages
            .filter((el) => el.id === pageId)
            .map((page) => {
              return <Article articles={page.articles} key={page.id} />;
            })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
