<template>
    <div class="h-screen grid" style="grid-template-rows: 1fr auto">
        <div :class="loaded ? 'loaded' : 'loading'" class="flex justify-center flex-col">
            <div class="mx-auto">
                <div class="mb-4 flex items-center">
                    <div :class="!loaded ? 'bg-gray-400' : online ? 'bg-green-400' : 'bg-red-400'" class="h-10 w-10 mt-1 rounded-full transition duration-200"></div>
                    <div class="ml-4 mt-auto">
                        <h2 :class="!loaded ? 'text-gray-700' : online ? 'text-green-900' : 'text-red-900'" class="text-lg transition duration-200">
                            Gratulacje
                        </h2>
                        <h1 class="text-gray-800">
                            {{ !loaded ? 'Znalazles bezuzyteczna strone' : online ? 'Jestes online, teraz sie ciesz.' : 'Zjebales :) Musisz naprawic.'}}
                        </h1>
                    </div>
                </div>
                <div ref="heatmap" class="grid grid-rows-7 gap-1" :style="{ gridTemplateColumns: 'auto repeat(' + (width - 1) + ', 1fr)' }">
                    <template v-for="i in range(width * 7)">
                        <div v-if="i % width === 0" class="text-xs h-4 text-gray-700">
                            {{ day[i / width ^ 0] }}
                        </div>
                        <div v-else class="heatmap-item h-4 w-4 transition duration-200"></div>
                    </template>
                </div>
            </div>
        </div>
        <div class="absolute opacity-100"></div>
        <div class="p-6 flex">
            <a rel="nofollow" href="https://wvffle.net" class="ml-auto">
                <img src="./assets/wvffle.svg" alt="wvffle.net" class="h-12">
            </a>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'
    import Chance from 'chance'
    import font from './assets/font'

    const WIDTH = 60

    const heatmapColors = [
        'green-200',
        'green-300',
        'green-400'
    ]

    const words = [
        'fuck',
        'offline',
        'ilovearch',
        'archlinux',
        'gofry',
        'lol',
        'zjebales'
    ]

    export default {
        setup () {
            const { seed } = localStorage
            const [ start ] = seed.split('.')

            const chance = new Chance(seed)
            const startDate = new Date(+start)

            // NOTE: Shift weeks
            const weekShift = ((new Date() - startDate) / (24 * 3600000)) / 7 ^ 0
            for (let i = 0; i < weekShift; ++i) {
                chance.pickset(heatmapColors, 7)
            }

            console.log('Shifted by', weekShift, 'weeks')

            const offline = JSON.parse(localStorage.offline)
            const tmpDate = new Date('1/1/666')

            const online = ref(false)
            const loaded = ref(false)
            const day = ref([...Array(7).keys()].map(i => {
                tmpDate.setDate(i + 7)
                return tmpDate.toLocaleDateString('en', { weekday: 'short' })
            }))
            const heatmap = ref(null)

            Promise.resolve().then(async () => {
                try {
                    await Promise.race([
                        fetch('/', { headers: { Accept: 'text/none' }}),
                        new Promise((_, reject) => setTimeout(reject, 1000))
                    ])

                    online.value = true
                } catch {
                    offline[new Date().toLocaleDateString()] = 1
                    localStorage.offline = JSON.stringify(offline)

                    online.value = false
                }

                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000))

                loaded.value = true

                const { children } = heatmap.value

                const now = new Date()
                const day = now.getDay()
                for (let i = 0; i < (WIDTH + 1) * 7; ++i) {
                    const date = new Date()

                    const x = i % (WIDTH + 1)
                    const y = i / (WIDTH + 1) ^ 0
                    date.setDate(now.getDate() - 7 + (y + 2) + 1 - 7 * (WIDTH - x))
                    children[i].title = date.toLocaleDateString()

                    if (offline[date.toLocaleDateString()]) {
                        children[i].classList.add('offline')
                        continue
                    }

                    if ((i + 1) % (WIDTH + 1) !== 0 || (i / (WIDTH + 1) ^ 0) <= day) {
                        children[i].classList.add(chance.pickone(heatmapColors))
                        continue
                    }

                    children[i].classList.add('unknown')
                }

                const text = words[Math.random() * words.length ^ 0]
                let offset = 2
                for (const char of text) {
                    let max = 0
                    for (const [x, y] of font[char]) {
                        max = Math.max(x, max)

                        const i = (y + 1) * (WIDTH + 1) + offset + x
                        children[i].classList.add('green-500')
                    }

                    offset += max + 2
                }
            })

            return {
                day,
                online,
                loaded,
                heatmap,
                width: ref(WIDTH + 1),
                range (n) {
                    return [...Array(n).keys()]
                }
            }
        }
    }

</script>

<style scoped lang="stylus">
    random(m, n)
        return math(0, 'random') * (n - m + 1) + m

    .heatmap-item
        box-shadow inset 0 0 0 100vh transparent

        for i in 1..(31*7)
            &:nth-child({i}n)
                animation heatmap-item-loading 3s infinite
                animation-delay random(-6, -3) * 1s

        &.green-200
            box-shadow inset 0 0 0 100vh #7add99

        &.green-300
            box-shadow inset 0 0 0 100vh #9ae6b4

        &.green-400
            box-shadow inset 0 0 0 100vh #68d391

        &.green-500
            box-shadow inset 0 0 0 100vh #48bb78

        &.unknown
            box-shadow inset 0 0 0 100vh white

        &.offline
            box-shadow inset 0 0 0 100vh #fc8181

    @keyframes heatmap-item-loading
        0%, 100%
            background #cbd5e0

        50%
            background #e2e8f0
</style>