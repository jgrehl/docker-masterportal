<script>
import {mapGetters, mapMutations} from "vuex";
import TableComponent from "../../../../share-components/table/components/TableComponent.vue";
import {getComponent} from "../../../../utils/getComponent";
import ToolTemplate from "../../ToolTemplate.vue";
import getters from "../store/gettersStatisticDashboard";
import mutations from "../store/mutationsStatisticDashboard";
import Controls from "./StatisticDashboardControls.vue";

export default {
    name: "StatisticDashboard",
    components: {
        ToolTemplate,
        TableComponent,
        Controls
    },
    data () {
        return {
            data: {
                headers: ["Raumeinheit", "2023", "2022"],
                items: [
                    ["Harburg", 1234, 1234],
                    ["Ludwigslust Parchim", 23456, 1234],
                    ["Lübeck", 23475, 1234],
                    ["Niedersachsen", 34844, 1234]
                ]
            },
            selectMode: "column",
            showHeader: true,
            sortable: true
        };
    },
    computed: {
        ...mapGetters("Tools/StatisticDashboard", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/StatisticDashboard", Object.keys(mutations)),

        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template>
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <Controls
                :descriptions="[{
                                    title: 'Trappatoni 1',
                                    content: 'Es gibt im Moment in diese Mannschaft, oh, einige Spieler vergessen ihnen Profi was sie sind.'
                                },
                                {
                                    title: 'Trappatoni 2 ',
                                    content: 'Ich lese nicht sehr viele Zeitungen, aber ich habe gehört viele Situationen.'
                                },
                                {
                                    title: 'Trappatoni 3 ',
                                    content: 'Letzte Spiel hatten wir in Platz drei Spitzen: Elber, Jancka und dann Zickler.'
                                }]"
            />
            <TableComponent
                :data="data"
                :select-mode="selectMode"
                :show-header="showHeader"
                :sortable="sortable"
            />
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
