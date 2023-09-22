export default {
    mounted (el, binding) {
        // console.log(el.getAttribute('src'), 'binding')
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const lazyImage = entry.target
                if (entry.intersectionRatio > 0) {
                    lazyImage.src = binding.value || el.getAttribute('src')
                    io.unobserve(lazyImage)
                }
            })
        })
        io.observe(el)
    }
}
