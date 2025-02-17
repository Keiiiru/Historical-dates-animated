import React, { useRef, useState } from "react";
import { ArticleType } from "../../../../shared/constants";
import "./index.sass";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../../../../widgets/button/index.tsx";
import ArrowRightIcon from "../../../../shared/icons/ArrowRightIcon.tsx";
import ArrowLeftIcon from "../../../../shared/icons/ArrowLeftIcon.tsx";
import { Navigation } from "swiper/modules";
import { useMediaQuery } from "usehooks-ts";

const Articles: React.FC<{
  articles: ArticleType[];
}> = ({ articles }): React.JSX.Element => {
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const swiperRef = useRef<any>(null);
  const matches = useMediaQuery("(min-width: 428px)");

  const slideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const slidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const updateNavigationState = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="swiper-container">
      <Button
        className={`button swiper-container__button ${
          isBeginning ? "invisible" : ""
        }`}
        onClick={slidePrev}
      >
        <ArrowLeftIcon />
      </Button>

      <Swiper
        className="articles-slider"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={50}
        slidesPerView={matches ? 3 : 1.6}
        onSlideChange={(swiper) => updateNavigationState(swiper)}
        modules={[Navigation]}
        onReachBeginning={() => setIsBeginning(true)}
        onReachEnd={() => setIsEnd(true)}
      >
        <div className="articles-slider__slider-container">
          {articles.map((article: ArticleType, idx: number) => (
            <SwiperSlide className="articles-slider__article" key={idx}>
              <span className="articles-slider__year">{article.year}</span>
              <p className="articles-slider__text">{article.text}</p>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      <Button
        className={`button swiper-container__button ${
          isEnd ? "invisible" : ""
        }`}
        onClick={slideNext}
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
};

export default Articles;
