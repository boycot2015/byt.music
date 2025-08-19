import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/scrollbar'
import { Scrollbar, A11y, Virtual } from 'swiper/modules'
export const useSwiper = () => {
  const swiper = ref(null)
  return {
    swiper,
    swiperOptions: {
        spaceBetween: 0,
    },
    Swiper,
    SwiperSlide,
    modules: [Scrollbar, A11y, Virtual],
  }
}