import { Box, Grid } from "@mui/material";
import { Thumbnail } from "@leanoncompany/supporti-react-ui";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface ICarouselProps {
  swiperInstance?: SwiperType;
  setSwiperInstance?: (swiper: SwiperType) => void;
  dataList: { [key: string]: any }[];
  renderCallback: (data: { [key: string]: any }) => React.ReactElement;
}

const Carousel = (props: ICarouselProps) => {
  const onInit = (swiper: any) => {
    if (props.setSwiperInstance) {
      props.setSwiperInstance(swiper);
    }
  };

  const onSlideChange = (swiper: any) => {
    const currentPage = swiper.activeIndex;

    if (props.swiperInstance) {
      props.swiperInstance.slideTo(currentPage);
    }
  };

  return (
    <Swiper
      onInit={onInit}
      spaceBetween={0}
      slidesPerView={1}
      watchSlidesProgress
      touchRatio={0.2}
      slideToClickedSlide={true}
      onSlideChange={onSlideChange}
    >
      {props.dataList.map((data, index) => (
        <SwiperSlide key={index}>{props.renderCallback(data)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
