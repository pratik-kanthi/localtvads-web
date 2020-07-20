<template>
    <div class="wrapper rounded d-flex justify-content-between pl8 pt8 pb8">
        <span v-for="(i, key) in 7" class="day" :class="{ selected: clonedValue.indexOf(i) > -1 }" :key="key" @click="chooseDay(i)">{{ days[i] }}</span>
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
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    background: $white;
    padding: 3px;
}

.day {
    cursor: pointer;
    height: 32px;
    width: 38px;
    margin-right: 8px;
    padding: 8px;
    background: $white;
    border: 1px solid $brand-primary;
    color: $brand-primary;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &.selected {
        background-color: $brand-primary;
        color: $white;
    }
}
</style>
