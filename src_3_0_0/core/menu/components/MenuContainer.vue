<script>
export default {
    name: "MenuContainer"
};
</script>

<template>
    <div
        id="menu-offcanvas"
        class="offcanvas offcanvas-start"
        tabindex="-1"
        aria-labelledby="offcanvasLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="offcanvasLabel"
                class="offcanvas-title"
            >
                {{ $t("common:menu.name") }}
            </h5>
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                :aria-label="$t('common:menu.ariaLabelClose')"
            />
        </div>
        <div class="offcanvas-body">
            Menü Inhalte kommen hierher!
        </div>
    </div>
</template>

<style scoped>

</style>
