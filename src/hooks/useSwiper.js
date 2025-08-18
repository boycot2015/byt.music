import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/scrollbar'
import { Scrollbar, A11y } from 'swiper/modules'
export const useSwiper = () => {
  const swiper = ref(null)
  return {
    swiper,
    swiperOptions: {
        // rewind: true,
        spaceBetween: 0,
    },
    Swiper,
    SwiperSlide,
    modules: [Scrollbar, A11y],
  }
}