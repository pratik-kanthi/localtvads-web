<template>
    <div class="wrapper rounded d-flex">
        <div :class="{ 'table-mode': mode === 'table' }" class="day-wrapper" v-for="(i, key) in 7" :key="key" @click="chooseDay(i)">
            <span class="day" :class="{ selected: clonedValue.indexOf(i) > -1 }">{{ days[i] | trucateChars(2) }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeekDays',
    props: {
        value: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String
        }
    },
    data() {
        return {
            days: ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            clonedValue: this.value
        };
    },
    methods: {
        chooseDay(d) {
            if (this.disabled) return;
            const index = this.clonedValue.indexOf(d);
            if (index > -1) {
                this.clonedValue.splice(index, 1);
            } else {
                this.clonedValue.push(d);
            }
            this.$emit('update:value', this.clonedValue);
        },
        trucateChars() {}
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    background: $white;
    padding: 8px 4px;
}
.day-wrapper {
    flex: 1;
    padding: 0 2px;
}

.day {
    display: flex;
    cursor: pointer;
    height: 32px;
    background: $white;
    border: 1px solid $brand-primary;
    color: $brand-primary;
    font-size: 14px;
    align-items: center;
    justify-content: center;

    &.selected {
        background-color: $brand-primary;
        color: $white;
    }
}

.table-mode {
    flex: 0;
    .day {
        display: flex;
        cursor: pointer;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background: $white;
        border: 1px solid $brand-primary;
        color: $brand-primary;
        font-size: 12px;
        align-items: center;
        justify-content: center;
        padding: 12px;
        margin-right: 4px;
        &.selected {
            background-color: $brand-primary;
            color: $white;
        }
    }
}
</style>
