import { Box, Grid } from '@mui/material';
import { Thumbnail } from '@leanoncompany/supporti-react-ui';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperClass from 'swiper/types/swiper-class';
import SwiperCore from 'swiper';

interface ICarouselProps {
  swiperInstance?: SwiperCore | undefined;
  setSwiperInstance?: React.Dispatch<React.SetStateAction<SwiperCore | undefined>>;
  dataList: { [key: string]: any }[];
  renderCallback: (data: { [key: string]: any }) => React.ReactElement;
}

const Carousel = (props: ICarouselProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore>();

  const onInit = (
    swiper: SwiperClass,
    setSwiperCore: React.Dispatch<React.SetStateAction<SwiperClass | undefined>>
  ) => {
    setSwiperCore(swiper);
  };

  const onSlideChange = (swiper: SwiperClass) => {
    const currentPage = swiper.activeIndex;
    console.log(currentPage);

    if (swiperInstance !== undefined) {
      swiperInstance.slideTo(currentPage);
    }
    /**
     * 1 => 1, 2 => 1, => 3 => 1
     */
  };

  return (
    <Swiper
      onInit={(swiper) => {
        onInit(swiper, setSwiperInstance);
      }}
      spaceBetween={0}
      slidesPerView={1}
      watchSlidesProgress
      touchRatio={0.2}
      slideToClickedSlide={true}
      onSlideChange={onSlideChange}>
      {props.dataList.map((data) => (
        <SwiperSlide>{props.renderCallback(data)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
