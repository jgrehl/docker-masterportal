<script>
export default {
    name: "StatisticGridComponent",
    props: {
        datas: {
            type: Array,
            required: true
        }
    }
};
</script>

<template>
    <div class="container">
        <div
            v-for="(data, idx) in datas"
            :key="idx"
        >
            <slot
                name="containers"
                :data="data"
            />
        </div>
    </div>
</template>
